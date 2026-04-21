const mongoose = require('mongoose');
const User = require('../models/tenant/User');
const StoreVisit = require('../models/employee/StoreVisit');
const inventoryOrderService = require('./inventoryOrderService');

class TeamPerformanceService {
  async getTeamPerformance(managerId, tenantId) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const mId = new mongoose.Types.ObjectId(managerId);
    const tId = new mongoose.Types.ObjectId(tenantId);

    // 1. Identify team members
    const teamMembers = await User.find({ 
      $or: [
        { role: 'employee', tenant: tId }, 
        { _id: mId }
      ]
    }, '_id name email status designation profile createdAt').lean();
    
    const teamMemberIds = teamMembers.map(m => m._id);

    // 2. Fetch today's visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visits = await StoreVisit.find({
      tenant: tId,
      employee: { $in: teamMemberIds },
      timestamp: { $gte: today }
    }).select('employee timestamp status').lean();

    // 3. Fetch Revenue Data
    let revenueByEmployee = {};
    try {
      const orderStats = await inventoryOrderService.getDashboardStats(tenantId, managerId, 'manager');
      if (orderStats.success) {
        revenueByEmployee = orderStats.data.revenueByEmployee || {};
      }
    } catch (err) {
      console.error('Failed to fetch revenue for team performance:', err);
    }

    // 4. Map Performance Metrics
    const memberPerformance = teamMembers.map(m => {
      const memberVisits = visits.filter(v => v.employee.toString() === m._id.toString());
      return {
        ...m,
        visitsToday: memberVisits.length,
        revenueToday: revenueByEmployee[m._id.toString()] || 0
      };
    });

    // 5. Identify field personnel vs management for accurate stats
    const fieldPersonnel = memberPerformance.filter(m => {
      const des = (m.designation || '').toLowerCase();
      // Exclude management roles from field-force KPIs
      return !des.includes('manager') && !des.includes('admin') && !des.includes('supervisor');
    });

    const managementCount = teamMembers.length - fieldPersonnel.length;
    const activeCount = teamMembers.filter(m => m.status === 'On Duty' || m.status === 'Active').length;
    const totalVisitsCount = visits.length;
    
    // Performance stats based ONLY on field personnel to avoid management skewing
    const targetVisits = 8 * fieldPersonnel.length; // Standard mission quota
    const targetPercent = targetVisits > 0 ? Math.round((totalVisitsCount / targetVisits) * 100) : 0;
    const avgVisits = fieldPersonnel.length > 0 ? (totalVisitsCount / fieldPersonnel.length).toFixed(1) : '0.0';
    const lowPerformers = fieldPersonnel.filter(m => m.visitsToday < 4).length;

    return {
      success: true,
      stats: {
        activeMembers: `${activeCount}/${teamMembers.length}`,
        activeCount,
        totalMembers: teamMembers.length,
        fieldPersonnelCount: fieldPersonnel.length,
        managementCount,
        targetAchievement: `${targetPercent}%`,
        targetPercent,
        avgVisits,
        lowPerformers: lowPerformers.toString()
      },
      members: memberPerformance
    };
  }
}

module.exports = new TeamPerformanceService();
