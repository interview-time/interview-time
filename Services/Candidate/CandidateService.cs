using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.S3;
using Amazon.S3.Model;
using CafApi.Models;
using CafApi.Services.User;

namespace CafApi.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly DynamoDBContext _context;
        private readonly IAmazonS3 _s3Client;
        private readonly IPermissionsService _permissionsService;

        public CandidateService(IAmazonDynamoDB dynamoDbClient, IAmazonS3 s3Client, IPermissionsService permissionsService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _s3Client = s3Client;
            _permissionsService = permissionsService;
        }

        public async Task<Candidate> GetCandidate(string teamId, string candidateId)
        {
            if (!string.IsNullOrWhiteSpace(candidateId))
            {
                return await _context.LoadAsync<Candidate>(teamId, candidateId);
            }

            return null;
        }

        public async Task<List<Candidate>> GetCandidates(string userId, string teamId)
        {
            var candidates = new List<Candidate>();

            var isBelongToTeam = await _permissionsService.IsBelongInTeam(userId, teamId);
            if (isBelongToTeam)
            {
                candidates = await _context.QueryAsync<Candidate>(teamId, new DynamoDBOperationConfig()).GetRemainingAsync();
            }

            return candidates;
        }

        public async Task<Candidate> UpdateCandidate(string userId, Candidate updatedCandidate)
        {
            var candidate = await GetCandidate(updatedCandidate.TeamId, updatedCandidate.CandidateId);
            var isBelongToTeam = await _permissionsService.IsBelongInTeam(userId, updatedCandidate.TeamId);

            if (candidate != null && isBelongToTeam)
            {
                candidate.CandidateName = updatedCandidate.CandidateName;
                candidate.CodingRepo = updatedCandidate.CodingRepo;
                candidate.GitHub = updatedCandidate.GitHub;
                candidate.LinkedIn = updatedCandidate.LinkedIn;
                candidate.Position = updatedCandidate.Position;
                candidate.ResumeFile = updatedCandidate.ResumeFile;
                candidate.Status = updatedCandidate.Status;
                candidate.Archived = updatedCandidate.Archived;
                candidate.ModifiedDate = DateTime.UtcNow;

                await _context.SaveAsync(candidate);

                return candidate;
            }

            return null;
        }

        public async Task DeleteCandidate(string userId, string teamId, string candidateId)
        {
            var isBelongToTeam = await _permissionsService.IsBelongInTeam(userId, teamId);
            if (isBelongToTeam)
            {
                // Get candidate interviews
                var searchByCandidate = _context.FromQueryAsync<Interview>(new QueryOperationConfig()
                {
                    IndexName = "CandidateId-index",
                    Filter = new QueryFilter(nameof(Interview.CandidateId), QueryOperator.Equal, candidateId)
                });
                var interviews = await searchByCandidate.GetRemainingAsync();

                // Delete candidate interviews
                if (interviews != null && interviews.Any())
                {
                    var interviewBatch = _context.CreateBatchWrite<Interview>();
                    interviewBatch.AddDeleteItems(interviews);
                    await interviewBatch.ExecuteAsync();
                }

                await _context.DeleteAsync<Candidate>(teamId, candidateId);
            }
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

        public string GetDownloadSignedUrl(string teamId, string candidateId, string filename)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "interviewtime",
                Key = $"teams/{teamId}/candidates/{candidateId}/{filename}",
                Verb = HttpVerb.GET,
                Expires = DateTime.Now.AddMinutes(30)
            };

            return _s3Client.GetPreSignedURL(request);
        }     
    }
}