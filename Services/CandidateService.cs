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

namespace CafApi.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly DynamoDBContext _context;
        private readonly IAmazonS3 _s3Client;
        private readonly IUserService _userService;

        public CandidateService(IAmazonDynamoDB dynamoDbClient, IAmazonS3 s3Client, IUserService userService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _userService = userService;
            _s3Client = s3Client;
        }

        public async Task<List<Candidate>> GetCandidates(string userId, string teamId)
        {
            var candidates = new List<Candidate>();

            var isBelongToTeam = await BelongsToTeam(userId, teamId);
            if (isBelongToTeam)
            {
                candidates = await _context.QueryAsync<Candidate>(teamId, new DynamoDBOperationConfig()).GetRemainingAsync();
            }

            return candidates;
        }

        public async Task<Candidate> CreateCandidate(string userId, Candidate candidate)
        {
            var isBelongToTeam = await BelongsToTeam(userId, candidate.TeamId);
            if (isBelongToTeam)
            {
                candidate.CreatedByUserId = userId;
                candidate.CandidateId = candidate.CandidateId ?? Guid.NewGuid().ToString();
                candidate.Status = CandidateStatus.NEW.ToString();
                candidate.ModifiedDate = DateTime.UtcNow;
                candidate.CreatedDate = DateTime.UtcNow;

                await _context.SaveAsync(candidate);

                return candidate;
            }

            return null;
        }

        public async Task<Candidate> UpdateCandidate(string userId, Candidate updatedCandidate)
        {
            var candidate = await _context.LoadAsync<Candidate>(updatedCandidate.TeamId, updatedCandidate.CandidateId);
            var isBelongToTeam = await BelongsToTeam(userId, updatedCandidate.TeamId);

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
            var isBelongToTeam = await BelongsToTeam(userId, teamId);
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
            var belongsToTeam = await BelongsToTeam(userId, teamId);
            if (belongsToTeam)
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = "interviewer-space",
                    Key = $"candidates/{candidateId}/{filename}",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.Now.AddHours(1)
                };

                return _s3Client.GetPreSignedURL(request);
            }

            return null;
        }

        public string GetDownloadSignedUrl(string candidateId, string filename)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "interviewer-space",
                Key = $"candidates/{candidateId}/{filename}",
                Verb = HttpVerb.GET,
                Expires = DateTime.Now.AddDays(30)
            };

            return _s3Client.GetPreSignedURL(request);
        }

        private async Task<bool> BelongsToTeam(string userId, string teamId)
        {
            if (!string.IsNullOrWhiteSpace(teamId))
            {
                var isBelongToTeam = await _userService.IsBelongInTeam(userId, teamId);
                if (isBelongToTeam)
                {
                    return true;
                }
            }
            else
            {
                return true;
            }

            return false;
        }
    }
}