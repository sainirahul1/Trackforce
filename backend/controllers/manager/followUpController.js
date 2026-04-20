const FollowUp = require('../../models/employee/FollowUp');
const EmployeeLogVisit = require('../../models/employee/EmployeeLogVisit');

// GET all follow-ups for the tenant
exports.getFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find({ tenant: req.tenantId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ nextFollowUpDate: 1, createdAt: -1 })
      .lean();
    res.json(followUps);
  } catch (err) {
    console.error('[FOLLOWUP] Get error:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET single follow-up with full history
exports.getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findOne({ _id: req.params.id, tenant: req.tenantId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .populate('visit')
      .lean();
    if (!followUp) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(followUp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a follow-up from a visit
exports.createFollowUp = async (req, res) => {
  try {
    const { visitId, nextFollowUpDate, priority, reason, note } = req.body;

    // Check if follow-up already exists for this visit
    const existing = await FollowUp.findOne({ visit: visitId, tenant: req.tenantId });
    if (existing) {
      return res.status(400).json({ message: 'Follow-up already exists for this visit', followUp: existing });
    }

    // Get visit details
    const visit = await EmployeeLogVisit.findById(visitId).populate('employee', 'name').lean();
    if (!visit) return res.status(404).json({ message: 'Visit not found' });

    const followUp = await FollowUp.create({
      visit: visitId,
      tenant: req.tenantId,
      storeName: visit.storeName,
      ownerName: visit.ownerName,
      mobileNumber: visit.mobileNumber,
      address: visit.address,
      city: visit.city,
      assignedTo: visit.employee?._id || req.user._id,
      assignedToName: visit.employee?.name || req.user.name,
      createdBy: req.user._id,
      createdByName: req.user.name,
      status: 'pending',
      priority: priority || 'medium',
      nextFollowUpDate: nextFollowUpDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Default: 3 days
      reason: reason || visit.visitForm?.notInterestedReason || 'Requires follow-up',
      visitType: visit.visitType,
      history: [{
        action: 'created',
        note: note || `Follow-up created from ${visit.visitType || 'mission'} visit.`,
        outcome: 'interested',
        scheduledDate: nextFollowUpDate,
        performedBy: req.user._id,
        performedByName: req.user.name,
      }]
    });

    res.status(201).json(followUp);
  } catch (err) {
    console.error('[FOLLOWUP] Create error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ADD a history entry (log a call, reschedule, etc.)
exports.addHistoryEntry = async (req, res) => {
  try {
    const { action, note, outcome, scheduledDate } = req.body;

    const updates = {
      $push: {
        history: {
          action,
          note,
          outcome,
          scheduledDate,
          performedBy: req.user._id,
          performedByName: req.user.name,
        }
      }
    };

    // Update status based on action
    if (action === 'converted') {
      updates.$set = { status: 'converted' };
    } else if (action === 'lost') {
      updates.$set = { status: 'lost' };
    } else if (action === 'rescheduled' && scheduledDate) {
      updates.$set = { nextFollowUpDate: scheduledDate, status: 'in_progress' };
    } else if (['called', 'visited'].includes(action)) {
      updates.$set = { status: 'in_progress' };
      if (scheduledDate) updates.$set.nextFollowUpDate = scheduledDate;
    }

    const followUp = await FollowUp.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenantId },
      updates,
      { new: true }
    );

    if (!followUp) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(followUp);
  } catch (err) {
    console.error('[FOLLOWUP] History error:', err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE follow-up (status, priority, assignment)
exports.updateFollowUp = async (req, res) => {
  try {
    const { status, priority, nextFollowUpDate, assignedTo, assignedToName } = req.body;
    const update = {};
    if (status) update.status = status;
    if (priority) update.priority = priority;
    if (nextFollowUpDate) update.nextFollowUpDate = nextFollowUpDate;
    if (assignedTo) { update.assignedTo = assignedTo; update.assignedToName = assignedToName; }

    const followUp = await FollowUp.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenantId },
      { $set: update },
      { new: true }
    );
    if (!followUp) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(followUp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
