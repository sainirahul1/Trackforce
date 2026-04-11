const Team = require('../models/manager/Team');
const User = require('../models/tenant/User');

class TeamService {
  async getTeams(managerId, tenantId) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    return await Team.find({
      manager: managerId,
      tenant: tenantId
    }).populate('members', 'name email role status profile');
  }

  async createTeam(managerId, tenantId, teamData) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const { name, description, memberIds } = teamData;
    if (!name) throw new Error('Team name is required');

    const team = await Team.create({
      name,
      description,
      manager: managerId,
      tenant: tenantId,
      members: memberIds || []
    });

    if (memberIds && memberIds.length > 0) {
      await User.updateMany(
        { _id: { $in: memberIds }, tenant: tenantId },
        { $set: { "profile.team": team.name } }
      );

      await Team.updateMany(
        { _id: { $ne: team._id }, tenant: tenantId },
        { $pull: { members: { $in: memberIds } } }
      );
    }

    return await team.populate('members', 'name email role status profile');
  }

  async updateTeam(managerId, tenantId, teamId, teamData) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const { name, description, memberIds } = teamData;
    const team = await Team.findOne({ _id: teamId, manager: managerId, tenant: tenantId });

    if (!team) throw new Error('Team not found or unauthorized');

    if (name) team.name = name;
    if (description !== undefined) team.description = description;

    if (memberIds) {
      team.members = memberIds;

      await Team.updateMany(
        { _id: { $ne: team._id }, tenant: tenantId },
        { $pull: { members: { $in: memberIds } } }
      );

      await User.updateMany(
        { _id: { $in: memberIds }, tenant: tenantId },
        { $set: { "profile.team": team.name } }
      );
    }

    await team.save();
    return await team.populate('members', 'name email role status profile');
  }

  async deleteTeam(managerId, tenantId, teamId) {
    if (!tenantId) throw new Error('Tenant isolation missing');

    const team = await Team.findOne({ _id: teamId, manager: managerId, tenant: tenantId });

    if (!team) throw new Error('Team not found or unauthorized');

    await User.updateMany(
      { _id: { $in: team.members }, tenant: tenantId },
      { $set: { "profile.team": "Unassigned" } }
    );

    await Team.deleteOne({ _id: teamId, tenant: tenantId });
    return true;
  }
}

module.exports = new TeamService();
