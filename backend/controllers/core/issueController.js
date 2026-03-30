const Issue = require('../../models/core/Issue');
const User = require('../../models/tenant/User');

// @desc    Create a new support issue
// @route   POST /api/issues
// @access  Private (Employee, Manager, etc.)
exports.createIssue = async (req, res) => {
  try {
    const { subject, description, priority, to } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const issue = await Issue.create({
      from: req.user.id,
      fromName: user.name,
      fromRole: user.role,
      to: to || 'manager', // Default to manager if not specified
      tenant: user.tenant,
      subject,
      description,
      priority: priority || 'Medium',
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get issues for the current user's role/tenant
// @route   GET /api/issues
// @access  Private
exports.getIssues = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let query = {};

    // Filter by role and tenant
    if (user.role === 'manager' || user.role === 'tenant') {
      // Manager/Tenant sees issues addressed to them within their organization
      query = { 
        tenant: user.tenant,
        to: user.role === 'manager' ? 'manager' : 'tenant'
      };
    } else if (user.role === 'superadmin') {
      // Superadmin sees issues addressed to them or all issues
      query = { to: 'superadmin' };
    } else {
      // Employee sees issues they created
      query = { from: req.user.id };
    }

    const issues = await Issue.find(query)
      .populate('from', 'name profile.profileImage')
      .sort({ createdAt: -1 });
    res.json(issues);
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
