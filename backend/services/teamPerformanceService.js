const mongoose = require('mongoose');
const User = require('../models/tenant/User');
const StoreVisit = require('../models/employee/StoreVisit');

class TeamPerformanceService {
  async getTeamPerformance(managerId, tenantId) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const mId = new mongoose.Types.ObjectId(managerId);
    const tId = new mongoose.Types.ObjectId(tenantId);

    // 1. Identify team members (Fetch ALL employees of the tenant to ensure consistency across portal)
    const teamMembers = await User.find({ 
      $or: [
        { role: 'employee', tenant: tId }, 
        { _id: mId }
      ]
    }, '_id name email status profile createdAt').lean();
    
    const teamMemberIds = teamMembers.map(m => m._id);

    // 2. Fetch today's visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visits = await StoreVisit.find({
      tenant: tId,
      employee: { $in: teamMemberIds },
      timestamp: { $gte: today }
    }).select('employee timestamp status').lean();

    // 3. Aggregate stats
    const activeCount = teamMembers.filter(m => m.status === 'On Duty' || m.status === 'Active').length;
    const totalVisitsCount = visits.length;
    
    // Performance per member
    const memberPerformance = teamMembers.map(member => {
      const memberVisits = visits.filter(v => v.employee.toString() === member._id.toString()).length;
      return {
        id: member._id,
        name: member.name,
        email: member.email,
        visitsToday: memberVisits,
        status: member.status,
        zone: member.profile?.zone || member.profile?.team || 'Unassigned',
        designation: member.profile?.designation || 'Employee',
        phone: member.profile?.phone || '+91 98765 43210',
        location: member.profile?.location || 'Unknown',
        joinDate: new Date(member.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        address: member.profile?.address || 'No address provided',
        skills: member.profile?.skills || [],
        dob: member.profile?.dob || 'N/A',
        gender: member.profile?.gender || 'N/A',
        bloodGroup: member.profile?.bloodGroup || 'N/A',
        emergencyContact: member.profile?.emergencyContact || 'N/A',
        target: 8
      };
    });

    const targetVisits = 8 * teamMembers.length;
    const targetPercent = targetVisits > 0 ? Math.round((totalVisitsCount / targetVisits) * 100) : 0;
    const avgVisits = teamMembers.length > 0 ? (totalVisitsCount / teamMembers.length).toFixed(1) : '0.0';
    const lowPerformers = memberPerformance.filter(m => m.visitsToday < 4).length;

    return {
      success: true,
      stats: {
        activeMembers: `${activeCount}/${teamMembers.length}`,
        activeCount,
        totalMembers: teamMembers.length,
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
