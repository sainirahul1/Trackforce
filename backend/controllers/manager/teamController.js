const Team = require('../../models/manager/Team');
const User = require('../../models/tenant/User');

// @desc    Get all teams for the currently logged in manager
// @route   GET /api/manager/teams
// @access  Private (Manager)
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      manager: req.user._id,
      tenant: req.tenantId
    }).populate('members', 'name email role status profile');

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new team
// @route   POST /api/manager/teams
// @access  Private (Manager)
exports.createTeam = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    // Step 1: Create the team
    const team = await Team.create({
      name,
      description,
      manager: req.user._id,
      tenant: req.tenantId,
      members: memberIds || []
    });

    // Step 2: Ensure employees are only in 1 team
    // For now, we update the profile.team field to the new team name or ID
    if (memberIds && memberIds.length > 0) {
      // First, remove these members from other teams managed by this tenant? 
      // User requested "an employee belong to 1 team".
      // We'll update the User profile.team field
      await User.updateMany(
        { _id: { $in: memberIds }, tenant: req.tenantId },
        { $set: { "profile.team": team.name } } // Storing team name or ID could be debated, but profile has .team as String.
      );

      // Also clean up other teams where these members were present
      await Team.updateMany(
        { _id: { $ne: team._id }, tenant: req.tenantId },
        { $pull: { members: { $in: memberIds } } }
      );
    }

    const populatedTeam = await team.populate('members', 'name email role status profile');
    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a team
// @route   PUT /api/manager/teams/:id
// @access  Private (Manager)
exports.updateTeam = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const teamId = req.params.id;

    const team = await Team.findOne({ _id: teamId, manager: req.user._id });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or unauthorized' });
    }

    if (name) team.name = name;
    if (description !== undefined) team.description = description;
    
    if (memberIds) {
      team.members = memberIds;

      // Ensure employees are only in 1 team (this one)
      // Step 1: Remove these members from ALL OTHER teams in this tenant
      await Team.updateMany(
        { _id: { $ne: team._id }, tenant: req.tenantId },
        { $pull: { members: { $in: memberIds } } }
      );

      // Step 2: Update member's profile.team
      await User.updateMany(
        { _id: { $in: memberIds }, tenant: req.tenantId },
        { $set: { "profile.team": team.name } }
      );
    }

    await team.save();
    const populatedTeam = await team.populate('members', 'name email role status profile');
    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a team
// @route   DELETE /api/manager/teams/:id
// @access  Private (Manager)
exports.deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await Team.findOne({ _id: teamId, manager: req.user._id });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or unauthorized' });
    }

    // Before deleting, clean up member profiles
    await User.updateMany(
      { _id: { $in: team.members }, tenant: req.tenantId },
      { $set: { "profile.team": "Unassigned" } }
    );

    await Team.deleteOne({ _id: teamId });
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
