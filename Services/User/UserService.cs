using System;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;
using CafApi.Services.User;

namespace CafApi.Services
{
    public class UserService : IUserService
    {
        private readonly DynamoDBContext _context;
        private readonly IPermissionsService _permissionsService;

        public UserService(IAmazonDynamoDB dynamoDbClient, IPermissionsService permissionsService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _permissionsService = permissionsService;
        }

        public async Task<Profile> GetProfile(string userId)
        {
            return await _context.LoadAsync<Profile>(userId);
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
            var isBelongToTeam = await _permissionsService.IsBelongInTeam(userId, currentTeamId);
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