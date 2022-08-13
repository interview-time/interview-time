using System;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;

namespace CafApi.Repository
{
    public class ChallengeRepository : IChallengeRepository
    {
        private readonly DynamoDBContext _context;

        public ChallengeRepository(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Challenge> GetChallenge(string teamId, string challengeId)
        {
            return await _context.LoadAsync<Challenge>(teamId, challengeId);
        }

        public async Task<OneTimeLink> GetOneTimeLink(string token)
        {
            return await _context.LoadAsync<OneTimeLink>(token);
        }

        public async Task<string> GenerateChallengeToken(string userId, string teamId, string challengeId, string interviewId, bool isOneTime = false)
        {
            var challenge = await GetChallenge(teamId, challengeId);
            if (challenge != null)
            {
                var oneTimeLink = new OneTimeLink
                {
                    Token = StringHelper.GenerateToken(),
                    TeamId = teamId,
                    ChallengeId = challengeId,
                    InterviewId = interviewId,
                    IsExpired = false,
                    IsOneTime = isOneTime,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow
                };

                await _context.SaveAsync(oneTimeLink);

                return oneTimeLink.Token;
            }

            return null;
        }
    }
}
