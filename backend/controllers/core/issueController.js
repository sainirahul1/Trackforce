const Issue = require('../../models/core/Issue');
const User = require('../../models/tenant/User');
const { logActivity } = require('../../utils/activityLogger');

// @desc    Create a new support issue
// @route   POST /api/issues
// @access  Private (Employee, Manager, etc.)
exports.createIssue = async (req, res) => {
  try {
    const { subject, description, priority, to } = req.body;
    
    // Ensure we have the user's name (might be missing from auth fast-path)
    let fromName = req.user.name;
    if (!fromName) {
      const user = await User.findById(req.user._id).select('name');
      fromName = user?.name || 'Anonymous';
    }

    const issue = await Issue.create({
      from: req.user._id,
      fromName,
      fromRole: req.user.role,
      to: to || 'manager', // Default to manager if not specified
      tenant: req.user.tenant,
      subject,
      description,
      priority: priority || 'Medium',
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('from', 'name profile.profileImage')
      .lean();

    // REAL-TIME SYNC: Notify the target role (e.g. Manager) about the new issue
    const io = req.app.get('io');
    if (io && populatedIssue) {
      const room = `tenant:${req.user.tenant}:role:${populatedIssue.to}`;
      io.to(room).emit('issue:new', populatedIssue);
    }

    // NEW: Log Activity & Create Formal Notification for the target role/manager
    // This makes it "properly" reflect in the notification system
    await logActivity({
      userId: req.user._id, // The creator's activity log
      tenantId: req.user.tenant,
      type: 'alert',
      title: 'Support Issue Raised',
      details: `New issue: "${subject}" created by ${fromName}.`,
      status: priority === 'High' ? 'urgent' : 'warning',
      metadata: { issueId: issue._id },
      notify: true, // This creates the Notification object
      priority: priority === 'High' ? 'high' : 'medium'
    });

    res.status(201).json(populatedIssue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get issues for the current user's role/tenant
// @route   GET /api/issues
// @access  Private
exports.getIssues = async (req, res) => {
  try {
    const { _id: userId, role, tenant } = req.user;
    let query = {};

    // Filter by role and tenant
    if (role === 'manager' || role === 'tenant') {
      // Manager/Tenant sees issues addressed to them within their organization
      query = { 
        tenant: tenant,
        to: role === 'manager' ? 'manager' : 'tenant'
      };
    } else if (role === 'superadmin') {
      // Superadmin sees issues addressed to them or all issues
      query = { to: 'superadmin' };
    } else {
      // Employee sees issues they created
      query = { from: userId };
    }

    const issues = await Issue.find(query)
      .populate('from', 'name profile.profileImage')
      .select('-description') // THIN PAYLOAD: exclude large text for list view
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(); // Faster serialization, plain JS objects

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single issue by ID
// @route   GET /api/issues/:id
// @access  Private
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('from', 'name profile.profileImage')
      .lean();

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update issue status or priority
// @route   PUT /api/issues/:id
// @access  Private
exports.updateIssue = async (req, res) => {
  try {
    const { status, priority } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Update fields if provided
    if (status) issue.status = status;
    if (priority) issue.priority = priority;

    const updatedIssue = await issue.save();
    
    // REAL-TIME SYNC: Notify the creator about the status change
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${issue.from}`).emit('issue:status_update', updatedIssue);
    }

    // NEW: Log Activity & Notify Creator about the update
    await logActivity({
      userId: issue.from,
      tenantId: issue.tenant,
      type: 'message',
      title: 'Issue Status Updated',
      details: `Your issue "${issue.subject}" has been updated to: ${status}.`,
      status: status === 'Resolved' ? 'success' : 'info',
      metadata: { issueId: updatedIssue._id, status },
      notify: true,
      priority: 'medium'
    });

    res.json(updatedIssue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Private
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await issue.deleteOne();
    res.json({ message: 'Issue removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
