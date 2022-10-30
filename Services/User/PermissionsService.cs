using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Services.User
{
    public class PermissionsService : IPermissionsService
    {
        private readonly DynamoDBContext _context;

        public PermissionsService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<bool> IsBelongInTeam(string userId, string teamId)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(teamId))
            {
                return false;
            }

            var teamMember = await _context.LoadAsync<TeamMember>(teamId, userId);

            return teamMember != null;
        }

        public async Task<(bool IsTeamMember, List<TeamRole> Roles)> IsTeamMember(string userId, string teamId)
        {
            var roles = new List<TeamRole>();

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(teamId))
            {
                return (false, roles);
            }

            var teamMember = await _context.LoadAsync<TeamMember>(teamId, userId);
            if (teamMember != null)
            {
                roles = GetUserRoles(teamMember);
            }

            return (teamMember != null, roles);
        }

        public async Task<List<TeamRole>> GetUserRoles(string userId, string teamId)
        {
            var teamMember = await _context.LoadAsync<TeamMember>(teamId, userId);
            if (teamMember != null && teamMember.Roles != null)
            {
                var userRoles = teamMember.Roles.Select(role => { Enum.TryParse(role, out TeamRole teamRole); return teamRole; }).ToList();

                return userRoles;
            }

            return null;
        }

        public static bool CanDeleteInterview(List<TeamRole> userRoles, bool isOwner)
        {
            if (isOwner)
            {
                return true;
            }

            if (userRoles != null && userRoles.Any(role => role == TeamRole.ADMIN))
            {
                return true;
            }

            return false;
        }

        public async Task<bool> CanCancelInvite(string userId, string teamId, bool isOwner)
        {
            var teamMember = await GetTeamMember(userId, teamId);

            // belongs to the team
            if (teamMember != null)
            {
                var userRoles = GetUserRoles(teamMember);

                if (isOwner)
                {
                    return true;
                }

                if (userRoles != null && userRoles.Any(role => role == TeamRole.ADMIN))
                {
                    return true;
                }
            }

            return false;
        }

        public async Task<bool> CanSendChallenge(string userId, string teamId, bool isInterviewer)
        {
            var teamMember = await GetTeamMember(userId, teamId);

            // belongs to the team
            if (teamMember != null)
            {
                var userRoles = GetUserRoles(teamMember);

                if (isInterviewer)
                {
                    return true;
                }

                if (userRoles != null && userRoles.Any(role => role == TeamRole.ADMIN))
                {
                    return true;
                }
            }

            return false;
        }

        public bool CanViewCandidate(List<TeamRole> userRoles, bool isInterviewer)
        {
            if (isInterviewer)
            {
                return true;
            }

            return userRoles != null && userRoles.Any(role => role != TeamRole.INTERVIEWER);
        }

        public async Task<bool> CanUpdateOrDeleteOrArchiveCandidate(string userId, string teamId)
        {
            var teamMember = await GetTeamMember(userId, teamId);

            // belongs to the team
            if (teamMember != null)
            {
                var userRoles = GetUserRoles(teamMember);

                return userRoles != null && userRoles.Any(role => role != TeamRole.INTERVIEWER);
            }

            return false;
        }

        public async Task<bool> CanIntegrateWithATS(string userId, string teamId)
        {
            var teamMember = await GetTeamMember(userId, teamId);

            // belongs to the team
            if (teamMember != null)
            {
                var userRoles = GetUserRoles(teamMember);

                return userRoles != null && userRoles.Any(role => role == TeamRole.ADMIN);
            }

            return false;
        }

        private async Task<TeamMember> GetTeamMember(string userId, string teamId)
        {
            return await _context.LoadAsync<TeamMember>(teamId, userId);
        }

        private List<TeamRole> GetUserRoles(TeamMember teamMember)
        {
            if (teamMember != null && teamMember.Roles != null)
            {
                var userRoles = teamMember.Roles.Select(role => { Enum.TryParse(role, out TeamRole teamRole); return teamRole; }).ToList();

                return userRoles;
            }

            return new List<TeamRole>();
        }
    }
}
