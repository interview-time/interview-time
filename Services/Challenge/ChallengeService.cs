using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.S3;
using Amazon.S3.Model;
using CafApi.Common;
using CafApi.Models;
using CafApi.Services.User;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public class ChallengeService : IChallengeService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly DynamoDBContext _context;
        private readonly IPermissionsService _permissionsService;

        public ChallengeService(IAmazonS3 s3Client, IAmazonDynamoDB dynamoDbClient, IPermissionsService permissionsService)
        {
            _s3Client = s3Client;
             _context = new DynamoDBContext(dynamoDbClient);
            _permissionsService = permissionsService;
        }

        public async Task<Challenge> GetChallenge(string teamId, string challengeId)
        {
            return await _context.LoadAsync<Challenge>(teamId, challengeId);
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
                challengesBatch.AddKey(challengeId);
            }
            await challengesBatch.ExecuteAsync();

            return challengesBatch.Results;
        }

        public async Task CreateChallenge(string userId, string teamId, CreateChallengeRequest request)
        {
            var challenge = new Challenge
            {
                TeamId = teamId,
                ChallengeId = request.ChallengeId,
                Name = request.Name,
                Order = request.Order,
                FileName = request.FileName,
                GitHubUrl = request.GitHubUrl,
                CreatedBy = userId,
                ModifiedBy = userId,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            await _context.SaveAsync(challenge);
        }

        public async Task<bool> UpdateChallenge(string userId, string teamId, string challengeId, UpdateChallengeRequest request)
        {
            var challenge = await GetChallenge(teamId, challengeId);
            if (challenge != null)
            {
                challenge.Name = request.Name;
                challenge.FileName = request.FileName;
                challenge.GitHubUrl = request.GitHubUrl;
                challenge.Order = request.Order;
                challenge.ModifiedDate = DateTime.UtcNow;
                challenge.ModifiedBy = userId;

                await _context.SaveAsync(challenge);

                return true;
            }

            return false;
        }

        public (string, DateTime) GetChallengeUploadSignedUrl(string teamId, string challengeId, string filename)
        {
            var expiryDate = DateTime.UtcNow.AddMinutes(30);

            var request = new GetPreSignedUrlRequest
            {
                BucketName = "interviewtime",
                Key = $"teams/{teamId}/challenges/{challengeId}/{filename}",
                Verb = HttpVerb.PUT,
                Expires = expiryDate
            };

            var url = _s3Client.GetPreSignedURL(request);

            return (url, expiryDate);
        }

        public (string, DateTime) GetChallengeDownloadSignedUrl(string teamId, string challengeId, string filename)
        {
            var expiryDate = DateTime.UtcNow.AddMinutes(30);

            var request = new GetPreSignedUrlRequest
            {
                BucketName = "interviewtime",
                Key = $"teams/{teamId}/challenges/{challengeId}/{filename}",
                Verb = HttpVerb.GET,
                Expires = expiryDate
            };

            var url = _s3Client.GetPreSignedURL(request);

            return (url, expiryDate);
        }

        public async Task<string> GenerateOneTimeToken(string userId, string teamId, string challengeId, string interviewId)
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
                    IsUsed = false,
                    CreatedBy = userId,
                    CreatedDate = DateTime.UtcNow
                };

                await _context.SaveAsync(oneTimeLink);

                return oneTimeLink.Token;
            }

            return null;
        }

        public async Task<string> UseOneTimeToken(string token)
        {
            var oneTimeToken = await _context.LoadAsync<OneTimeLink>(token);
            if (oneTimeToken != null)
            {
                oneTimeToken.IsUsed = true;
                oneTimeToken.UsedDate = DateTime.UtcNow;

                await _context.SaveAsync(oneTimeToken);

                var challenge = await GetChallenge(oneTimeToken.TeamId, oneTimeToken.ChallengeId);
                if (challenge != null)
                {
                    var request = new GetPreSignedUrlRequest
                    {
                        BucketName = "interviewtime",
                        Key = $"teams/{challenge.TeamId}/challenges/{challenge.ChallengeId}/{challenge.FileName}",
                        Verb = HttpVerb.GET,
                        Expires = DateTime.UtcNow.AddMinutes(5)
                    };

                    return _s3Client.GetPreSignedURL(request);
                }
            }

            return null;
        }
    }
}