using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Models;
using CafApi.Utils;

namespace CafApi.Services
{
    public class TeamService : ITeamService
    {
        private readonly IUserService _userService;
        private readonly DynamoDBContext _context;

        public TeamService(IAmazonDynamoDB dynamoDbClient, IUserService userService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _userService = userService;
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
                Token = StringHelper.GenerateToken(),
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
            };

            await _context.SaveAsync(team);

            // add the user to the team 
            await AddToTeam(userId, team.TeamId);

            return team;
        }

        public async Task Update(string userId, string teamId, string name)
        {
            var team = await GetTeam(teamId);
            if (team != null && team.OwnerId == userId)
            {
                team.Name = name;
                team.ModifiedDate = DateTime.UtcNow;

                await _context.SaveAsync(team);
            }
        }

        public async Task<List<Team>> GetTeams(List<string> teamIds)
        {
            var teams = new List<Team>();

            if (teamIds != null && teamIds.Any())
            {
                foreach (var teamId in teamIds)
                {
                    var team = await GetTeam(teamId);
                    if (team != null)
                    {
                        teams.Add(team);
                    }
                }
            }

            return teams;
        }

        public async Task<List<Profile>> GetTeamMembers(string userId, string teamId)
        {
            // check if user belongs to the team
            var belongsToTeam = await _userService.IsBelongInTeam(userId, teamId);
            if (belongsToTeam)
            {
                var scanConditions = new List<ScanCondition>{
                new ScanCondition(nameof(Profile.Teams), ScanOperator.Contains, teamId)
            };

                var result = _context.ScanAsync<Profile>(scanConditions);
                var members = await result.GetRemainingAsync();

                return members;
            }

            return new List<Profile>();
        }

        public async Task<Team> JoinTeam(string userId, string token)
        {
            var search = _context.FromQueryAsync<Team>(new QueryOperationConfig()
            {
                IndexName = "Token-index",
                Filter = new QueryFilter(nameof(Template.Token), QueryOperator.Equal, token)
            });
            var teams = await search.GetRemainingAsync();
            var team = teams.FirstOrDefault();

            if (teams != null)
            {
                await AddToTeam(userId, teams.First().TeamId);
            }

            return team;
        }

        public async Task LeaveTeam(string userId, string teamId)
        {
            var profile = await _userService.GetProfile(userId);
            if (profile != null && profile.Teams != null && profile.Teams.Contains(teamId))
            {
                profile.Teams.Remove(teamId);
                if (profile.Teams.Count == 0)
                {
                    profile.Teams = null;
                }

                await _context.SaveAsync(profile);
            }
        }

        private async Task AddToTeam(string userId, string teamId)
        {
            var profile = await _userService.GetProfile(userId);
            if (profile != null)
            {
                if (profile.Teams == null)
                {
                    profile.Teams = new List<string> { teamId };
                }
                else if (!profile.Teams.Contains(teamId))
                {
                    profile.Teams.Add(teamId);
                }
                await _context.SaveAsync(profile);
            }
        }
    }
}