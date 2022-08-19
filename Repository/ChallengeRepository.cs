using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<List<Challenge>> GetChallenges(string teamId, List<string> challengeIds)
        {
            if (challengeIds == null || !challengeIds.Any())
            {
                return null;
            }

            var challengesBatch = _context.CreateBatchGet<Challenge>();
            foreach (var challengeId in challengeIds)
            {
                challengesBatch.AddKey(teamId, challengeId);
            }
            await challengesBatch.ExecuteAsync();

            return challengesBatch.Results;
        }

        public async Task BatchAddChallenges(List<Challenge> challenges)
        {
            if (challenges == null || !challenges.Any())
            {
                return;
            }

            var challengeBatch = _context.CreateBatchWrite<Challenge>();
            challengeBatch.AddPutItems(challenges);
            await challengeBatch.ExecuteAsync();
        }
    }
}
