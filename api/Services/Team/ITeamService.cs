using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface ITeamService
    {
        Task<TeamMember> GetTeamMember(string userId, string teamId);

        Task Update(string userId, string teamId, string name);

        Task Delete(string userId, string teamId);

        Task<List<(Team, TeamMember)>> GetUserTeams(string userId);

        Task<List<(Profile, TeamMember)>> GetTeamMembers(string userId, string teamId);

        Task<List<Invite>> GetPendingInvites(string userId, string teamId);

        Task Invite(string userId, string inviteeEmail, string teamId, string role);

        Task CancelInvite(string userId, string teamId, string inviteId);

        Task<string> AcceptInvite(string userId, string inviteToken);

        Task LeaveTeam(string userId, string teamId);

        Task RemoveTeamMember(string adminId, string memberId, string teamId);

        Task UpdateMemberRole(string adminId, string memberId, string teamId, string newRole);
    }
}
