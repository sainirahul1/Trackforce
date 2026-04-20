const FollowUp = require('../../models/employee/FollowUp');

// GET all follow-ups assigned to the logged-in employee
exports.getEmployeeFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find({ 
      tenant: req.tenantId,
      assignedTo: req.user._id 
    })
      .populate('createdBy', 'name')
      .populate('visit', 'photos')
      .sort({ nextFollowUpDate: 1, createdAt: -1 })
      .lean();
    res.json(followUps);
  } catch (err) {
    console.error('[EMPLOYEE FOLLOWUP] Get error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ADD a history entry (log a call, reschedule, etc.) as the employee
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
      { _id: req.params.id, tenant: req.tenantId, assignedTo: req.user._id },
      updates,
      { new: true }
    );

    if (!followUp) return res.status(404).json({ message: 'Follow-up not found or not assigned to you' });
    res.json(followUp);
  } catch (err) {
    console.error('[EMPLOYEE FOLLOWUP] History error:', err);
    res.status(500).json({ message: err.message });
  }
};
