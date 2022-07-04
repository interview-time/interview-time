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
            var teamMember = await _context.LoadAsync<TeamMember>(teamId, userId);

            return teamMember != null;
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
    }
}