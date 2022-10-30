using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services.User
{
    public interface IPermissionsService
    {
        Task<(bool IsTeamMember, List<TeamRole> Roles)> IsTeamMember(string userId, string teamId);

        Task<bool> IsBelongInTeam(string userId, string teamId);

        Task<List<TeamRole>> GetUserRoles(string userId, string teamId);

        Task<bool> CanCancelInvite(string userId, string teamId, bool isOwner);

        Task<bool> CanSendChallenge(string userId, string teamId, bool isInterviewer);

        bool CanViewCandidate(List<TeamRole> userRoles, bool isInterviewer);

        Task<bool> CanUpdateOrDeleteOrArchiveCandidate(string userId, string teamId);

        Task<bool> CanIntegrateWithATS(string userId, string teamId);
    }
}
