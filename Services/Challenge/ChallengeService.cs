using System;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.S3;
using Amazon.S3.Model;
using CafApi.Models;
using CafApi.Repository;

namespace CafApi.Services
{
    public class ChallengeService : IChallengeService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly DynamoDBContext _context;
        private readonly IChallengeRepository _challengeRepository;

        public ChallengeService(IAmazonS3 s3Client,
            IAmazonDynamoDB dynamoDbClient,
            IChallengeRepository challengeRepository)
        {
            _s3Client = s3Client;
            _context = new DynamoDBContext(dynamoDbClient);
            _challengeRepository = challengeRepository;
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

        public async Task<string> GetChallengeDirectUrl(string token)
        {
            var oneTimeToken = await _context.LoadAsync<OneTimeLink>(token);
            if (oneTimeToken != null && !oneTimeToken.IsExpired)
            {
                oneTimeToken.IsExpired = oneTimeToken.IsOneTime; // invalidate token if it's one-time use
                oneTimeToken.UsedDate = DateTime.UtcNow;

                await _context.SaveAsync(oneTimeToken);

                var challenge = await _challengeRepository.GetChallenge(oneTimeToken.TeamId, oneTimeToken.ChallengeId);
                if (challenge != null && challenge.FileName != null)
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