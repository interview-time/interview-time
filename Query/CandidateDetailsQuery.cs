using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.S3;
using Amazon.S3.Model;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Query
{
    public class CandidateDetailsQuery : IRequest<CandidateDetailsQueryResult>
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string CandidateId { get; set; }
    }

    public class CandidateDetailsQueryResult
    {
        public string CandidateId { get; set; }

        public string CandidateName { get; set; }

        public string Position { get; set; }

        public string Email { get; set; }

        public string ResumeUrl { get; set; }

        public string LinkedIn { get; set; }

        public string GitHub { get; set; }

        public string Status { get; set; }

        public bool Archived { get; set; }

        public bool IsFromATS { get; set; }

        public List<Interview> Interviews { get; set; }

        public DateTime CreatedDate { get; set; }
    }

    public class CandidateDetailsQueryHandler : IRequestHandler<CandidateDetailsQuery, CandidateDetailsQueryResult>
    {
        private readonly ICandidateRepository _candidateRepository;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly DynamoDBContext _context;
        private readonly IAmazonS3 _s3Client;

        public CandidateDetailsQueryHandler(
            ICandidateRepository candidateRepository,
            IInterviewRepository interviewRepository,
            IPermissionsService permissionsService,
            IAmazonDynamoDB dynamoDbClient,
            IAmazonS3 s3Client)
        {
            _candidateRepository = candidateRepository;
            _interviewRepository = interviewRepository;
            _permissionsService = permissionsService;
            _context = new DynamoDBContext(dynamoDbClient);

            _s3Client = s3Client;
        }

        public async Task<CandidateDetailsQueryResult> Handle(CandidateDetailsQuery query, CancellationToken cancellationToken)
        {
            var (isTeamMember, roles) = await _permissionsService.IsTeamMember(query.UserId, query.TeamId);
            if (!isTeamMember)
            {
                throw new AuthorizationException($"User ({query.UserId}) cannot view candidate details ({query.CandidateId})");
            }

            var candidate = await _candidateRepository.GetCandidate(query.TeamId, query.CandidateId);
            if (candidate == null)
            {
                throw new ItemNotFoundException($"Candidate {query.CandidateId} not found");
            }

            var interviews = await _interviewRepository.GetInterviewsByCandidate(query.CandidateId);

            var isInterviewer = interviews.Any(i => i.UserId == query.UserId);
            if (!_permissionsService.CanViewCandidate(roles, isInterviewer))
            {
                throw new AuthorizationException($"User ({query.UserId}) cannot view candidate details ({query.CandidateId})");
            }

            return new CandidateDetailsQueryResult
            {
                CandidateId = candidate.CandidateId,
                CandidateName = candidate.CandidateName,
                Position = candidate.Position,
                Email = candidate.Email,
                ResumeUrl = candidate.ResumeFile != null ? GetDownloadSignedUrl(query.TeamId, query.CandidateId, candidate.ResumeFile) : null,
                LinkedIn = candidate.LinkedIn,
                GitHub = candidate.GitHub,
                Status = candidate.Status,
                Archived = candidate.Archived,
                IsFromATS = !string.IsNullOrWhiteSpace(candidate.MergeId),
                Interviews = interviews,
                CreatedDate = candidate.RemoteCreatedDate ?? candidate.CreatedDate
            };
        }

        private string GetDownloadSignedUrl(string teamId, string candidateId, string filename)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "interviewtime",
                Key = $"teams/{teamId}/candidates/{candidateId}/{filename}",
                Verb = HttpVerb.GET,
                Expires = DateTime.Now.AddDays(1)
            };

            return _s3Client.GetPreSignedURL(request);
        }
    }
}
