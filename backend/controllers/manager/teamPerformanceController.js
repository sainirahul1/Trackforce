const teamPerformanceService = require('../../services/teamPerformanceService');

/**
 * Team Performance Controller
 * Handles aggregation of team visits and targets for managers.
 */
exports.getTeamPerformance = async (req, res) => {
  try {
    const { _id: managerId, tenant: tenantId } = req.user;
    
    if (!managerId || !tenantId) {
      return res.status(400).json({ message: "Incomplete authentication context" });
    }

    const performanceData = await teamPerformanceService.getTeamPerformance(managerId, tenantId);
    res.json(performanceData);
  } catch (error) {
    console.error('Error in getTeamPerformance:', error);
    res.status(500).json({ message: error.message || "Failed to aggregate team performance" });
  }
};
