const teamService = require('../../services/teamService');

// @desc    Get all teams for the currently logged in manager
// @route   GET /api/manager/teams
// @access  Private (Manager)
exports.getTeams = async (req, res) => {
  try {
    const teams = await teamService.getTeams(req.user._id, req.tenantId);
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
    const team = await teamService.createTeam(req.user._id, req.tenantId, req.body);
    res.status(201).json(team);
  } catch (error) {
    if (error.message === 'Team name is required') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a team
// @route   PUT /api/manager/teams/:id
// @access  Private (Manager)
exports.updateTeam = async (req, res) => {
  try {
    const team = await teamService.updateTeam(req.user._id, req.tenantId, req.params.id, req.body);
    res.json(team);
  } catch (error) {
    if (error.message === 'Team not found or unauthorized') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a team
// @route   DELETE /api/manager/teams/:id
// @access  Private (Manager)
exports.deleteTeam = async (req, res) => {
  try {
    await teamService.deleteTeam(req.user._id, req.tenantId, req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    if (error.message === 'Team not found or unauthorized') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
