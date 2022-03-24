using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Services
{
    public class UserService : IUserService
    {
        private readonly DynamoDBContext _context;

        public UserService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Profile> GetProfile(string userId)
        {
            return await _context.LoadAsync<Profile>(userId);
        }

        public async Task<List<Profile>> GetUserProfiles(List<string> userIds)
        {
            if (userIds == null || !userIds.Any())
            {
                return new List<Profile>();
            }

            var profileBatch = _context.CreateBatchGet<Profile>();

            foreach (var userId in userIds)
            {
                profileBatch.AddKey(userId);
            }

            await profileBatch.ExecuteAsync();

            return profileBatch.Results;
        }

        public async Task<Profile> CreateProfile(string userId, string name, string email, int timezoneOffset, string timezone, string currentTeamId)
        {
            var profile = new Profile
            {
                UserId = userId,
                Name = name,
                Email = email,
                TimezoneOffset = timezoneOffset,
                Timezone = timezone,
                CurrentTeamId = currentTeamId,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            await _context.SaveAsync(profile);

            return profile;
        }

        public async Task<bool> IsBelongInTeam(string userId, string teamId)
        {
            var teamMember = await _context.LoadAsync<TeamMember>(teamId, userId);

            return teamMember != null;
        }

        public async Task UpdateCurrentTeam(string userId, string currentTeamId)
        {
            var isBelongToTeam = await IsBelongInTeam(userId, currentTeamId);
            if (isBelongToTeam)
            {
                var profile = await GetProfile(userId);
                if (profile != null)
                {
                    profile.CurrentTeamId = currentTeamId;
                    profile.ModifiedDate = DateTime.UtcNow;

                    await _context.SaveAsync(profile);
                }
            }
        }
    }
}