using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services.User
{
    public interface IPermissionsService
    {
        Task<bool> IsBelongInTeam(string userId, string teamId);

        Task<List<TeamRole>> GetUserRoles(string userId, string teamId);

        Task<bool> CanCancelInvite(string userId, string teamId, bool isOwner);

        Task<bool> CanSendChallenge(string userId, string teamId, bool isInterviewer);
    }
}
