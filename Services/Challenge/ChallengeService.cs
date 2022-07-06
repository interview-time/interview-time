using System;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using CafApi.Services.User;

namespace CafApi.Services
{
    public class ChallengeService : IChallengeService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IPermissionsService _permissionsService;

        public ChallengeService(IAmazonS3 s3Client, IPermissionsService permissionsService)
        {
            _s3Client = s3Client;
            _permissionsService = permissionsService;
        }

        public async Task<(string, DateTime)?> GetChallengeUploadSignedUrl(string userId, string teamId, string challengeId, string filename)
        {
            var isBelongInTeam = await _permissionsService.IsBelongInTeam(userId, teamId);
            if (isBelongInTeam)
            {
                var expiryDate = DateTime.UtcNow.AddMinutes(60);

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

            return null;
        }

        public async Task<(string, DateTime)?> GetChallengeDownloadSignedUrl(string userId, string teamId, string challengeId, string filename)
        {
            var isBelongInTeam = await _permissionsService.IsBelongInTeam(userId, teamId);
            if (isBelongInTeam)
            {
                var expiryDate = DateTime.UtcNow.AddMinutes(60);

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

            return null;
        }

        // public async Task<string> GenerateOnTimeLink(string userId, string teamId, string challengeId)
        // {

        // }
    }
}