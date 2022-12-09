using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;

namespace CafApi.Repository
{
    public class TeamRepository : ITeamRepository
    {
        private readonly DynamoDBContext _context;
        public TeamRepository(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Team> GetTeam(string teamId)
        {
            return await _context.LoadAsync<Team>(teamId);
        }

        public async Task<Team> CreateTeam(string userId, string name)
        {
            var team = new Team
            {
                TeamId = Guid.NewGuid().ToString(),
                OwnerId = userId,
                Name = name,
                Seats = 2,
                Plan = SubscriptionPlan.STARTER.ToString(),
                Token = StringHelper.GenerateToken(),
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
            };

            await _context.SaveAsync(team);

            // add the user to the team
            await AddToTeam(userId, team.TeamId, TeamRole.ADMIN.ToString());

            return team;
        }

        public async Task<bool> AddToTeam(string userId, string teamId, string role = null)
        {
            var teamMember = await _context.LoadAsync<TeamMember>(teamId, userId);
            var team = await GetTeam(teamId);

            if (teamMember == null && team != null)
            {
                teamMember = new TeamMember
                {
                    TeamId = teamId,
                    UserId = userId,
                    Roles = new List<string> { role ?? TeamRole.INTERVIEWER.ToString() },
                    ModifiedDate = DateTime.UtcNow,
                    CreatedDate = DateTime.UtcNow
                };

                await _context.SaveAsync(teamMember);

                return true;
            }

            return false;
        }
    }
}
