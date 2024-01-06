using System;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using CafApi.Services.User;

namespace CafApi.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IPermissionsService _permissionsService;

        public CandidateService(IAmazonS3 s3Client, IPermissionsService permissionsService)
        {
            _s3Client = s3Client;
            _permissionsService = permissionsService;
        }

        public async Task<string> GetUploadSignedUrl(string userId, string teamId, string candidateId, string filename)
        {
            var belongsToTeam = await _permissionsService.IsBelongInTeam(userId, teamId);
            if (belongsToTeam)
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = "interviewtime",
                    Key = $"teams/{teamId}/candidates/{candidateId}/{filename}",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.Now.AddHours(1)
                };

                return _s3Client.GetPreSignedURL(request);
            }

            return null;
        }
    }
}
