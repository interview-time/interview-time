using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface ITeamService
    {
        Task<Team> GetTeam(string teamId);

        Task<Team> CreateTeam(string userId, string name);

        Task Update(string userId, string teamId, string name);

        Task Delete(string userId, string teamId);

        Task<List<(Team, TeamMember)>> GetUserTeams(string userId);

        Task<List<(Profile, TeamMember)>> GetTeamMembers(string userId, string teamId);

        Task<Team> JoinTeam(string userId, string token, string role = null);

        Task LeaveTeam(string userId, string teamId);

        Task RemoveTeamMember(string adminId, string memberId, string teamId);

        Task UpdateMemberRole(string adminId, string memberId, string teamId, string newRole);
    }
}