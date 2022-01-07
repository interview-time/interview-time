using System;
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

        public async Task<Profile> CreateProfile(string userId, string name, string email, int timezoneOffset)
        {
            var profile = new Profile
            {
                UserId = userId,
                Name = name,
                Email = email,
                TimezoneOffset = timezoneOffset,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            await _context.SaveAsync(profile);

            return profile;
        }

        public async Task<bool> IsBelongInTeam(string userId, string teamId)
        {
            var profile = await _context.LoadAsync<Profile>(userId);

            return (profile != null && profile.Teams != null && profile.Teams.Any(t => t.TeamId == teamId));
        }
    }
}