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
    }
}