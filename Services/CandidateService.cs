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
            if (teamId != null)
            {
                var team = await _context.LoadAsync<Team>(teamId);
                if (team != null && team.OwnerId == userId) // Team admin can see all candidates
                {
                    var searchByTeam = _context.FromQueryAsync<Candidate>(new QueryOperationConfig()
                    {
                        IndexName = "TeamId-index",
                        Filter = new QueryFilter(nameof(Candidate.TeamId), QueryOperator.Equal, teamId)
                    });

                    return await searchByTeam.GetRemainingAsync();
                }
            }

            // get candidates visible to this user
            var searchByUser = _context.FromQueryAsync<Candidate>(new QueryOperationConfig()
            {
                IndexName = "UserId-index",
                Filter = new QueryFilter(nameof(Candidate.UserId), QueryOperator.Equal, userId)
            });

            return await searchByUser.GetRemainingAsync();
        }

        public async Task<Candidate> CreateCandidate(string userId, Candidate candidate)
        {
            var canCreateCandidate = await CanCreateCandidate(userId, candidate.TeamId);
            if (canCreateCandidate)
            {
                candidate.UserId = userId;
                candidate.CandidateId = Guid.NewGuid().ToString();
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
            var canAccessCandidate = await CanUserAccessCandidate(userId, updatedCandidate.CandidateId);
            if (canAccessCandidate)
            {
                var candidate = await _context.LoadAsync<Candidate>(updatedCandidate.CandidateId);
                if (candidate != null)
                {
                    candidate.CandidateName = updatedCandidate.CandidateName;
                    candidate.CodingRepo = updatedCandidate.CodingRepo;
                    candidate.GitHub = updatedCandidate.GitHub;
                    candidate.LinkedIn = updatedCandidate.LinkedIn;
                    candidate.Position = updatedCandidate.Position;
                    candidate.ResumeFile = updatedCandidate.ResumeFile;
                    candidate.Status = updatedCandidate.Status;
                    candidate.ModifiedDate = DateTime.UtcNow;

                    await _context.SaveAsync(candidate);

                    return candidate;
                }
            }

            return null;
        }

        public async Task DeleteCandidate(string userId, string candidateId)
        {
            var canAccessCandidate = await CanUserAccessCandidate(userId, candidateId);
            if (canAccessCandidate)
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

                await _context.DeleteAsync<Candidate>(candidateId);
            }
        }

        public async Task<string> GetUploadSignedUrl(string userId, string candidateId, string filename)
        {
            var canAccessCandidate = await CanUserAccessCandidate(userId, candidateId);
            if (canAccessCandidate)
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = "interviewer-space",
                    Key = $"candidates/{candidateId}/{filename}",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.Now.AddMinutes(30)
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

        private async Task<bool> CanUserAccessCandidate(string userId, string candidateId)
        {
            var candidate = await _context.LoadAsync<Candidate>(candidateId);
            if (candidate != null)
            {
                if (candidate.UserId == userId)
                {
                    return true;
                }
                else if (candidate.TeamId != null)
                {
                    var team = await _context.LoadAsync<Team>(candidate.TeamId);
                    if (team != null && team.OwnerId == userId)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private async Task<bool> CanCreateCandidate(string userId, string teamId)
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