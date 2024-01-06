using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DynamoDBContext _context;
        public UserRepository(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
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

        public async Task<Profile> GetProfile(string userId)
        {
            return await _context.LoadAsync<Profile>(userId);
        }

        public async Task UpdateProfile(string userId, string name, string position, int timezoneOffset, string timezone)
        {
            var profile = await GetProfile(userId);
            if (profile != null)
            {
                profile.ModifiedDate = DateTime.UtcNow;
                profile.Name = name;
                profile.Position = position;
                profile.TimezoneOffset = timezoneOffset;
                profile.Timezone = timezone;

                await _context.SaveAsync(profile);
            }
        }

        public async Task UpdateCurrentTeam(string userId, string currentTeamId)
        {
            var profile = await GetProfile(userId);
            if (profile != null)
            {
                profile.CurrentTeamId = currentTeamId;
                profile.ModifiedDate = DateTime.UtcNow;

                await _context.SaveAsync(profile);
            }
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
    }
}
