using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Query
{
    public class CandidatesQuery : IRequest<CandidatesQueryResult>
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }
    }

    public class CandidatesQueryResult
    {
        public List<CandidateItem> Candidates { get; set; }
    }

    public class CandidateItem
    {
        public string CandidateId { get; set; }

        public string CandidateName { get; set; }

        public string Position { get; set; }

        public string Status { get; set; }

        public bool Archived { get; set; }

        public DateTime CreatedDate { get; set; }
    }

    public class CandidatesQueryHandler : IRequestHandler<CandidatesQuery, CandidatesQueryResult>
    {
        private readonly ICandidateRepository _candidateRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly DynamoDBContext _context;
        private readonly IAmazonDynamoDB _client;

        public CandidatesQueryHandler(ICandidateRepository candidateRepository,
            IPermissionsService permissionsService,
            IAmazonDynamoDB dynamoDbClient)
        {
            _candidateRepository = candidateRepository;
            _permissionsService = permissionsService;
            _context = new DynamoDBContext(dynamoDbClient);
            _client = dynamoDbClient;
        }

        public async Task<CandidatesQueryResult> Handle(CandidatesQuery query, CancellationToken cancellationToken)
        {
            var teamMember = await _permissionsService.IsTeamMember(query.UserId, query.TeamId);
            if (!teamMember.IsTeamMember)
            {
                throw new AuthorizationException($"User ({query.UserId}) cannot view candidates of team ({query.TeamId})");
            }

            List<Candidate> candidates = null;
            if (teamMember.Roles.Contains(TeamRole.INTERVIEWER))
            {
                // Interviewer can only see candidates they interviewed and will interview
                var config = new DynamoDBOperationConfig();
                var interviews = await _context.QueryAsync<Interview>(query.UserId, config).GetRemainingAsync();

                var candidateIds = interviews
                    .Where(i => i.TeamId == query.TeamId && !string.IsNullOrWhiteSpace(i.CandidateId))
                    .Select(i => i.CandidateId)
                    .Distinct()
                    .ToList();

                candidates = await _candidateRepository.GetCandidates(query.TeamId, candidateIds);
            }
            else
            {
                // Recruiter or Hiring Manager can see all candidates
                candidates = await _context.QueryAsync<Candidate>(query.TeamId, new DynamoDBOperationConfig()).GetRemainingAsync();
            }

            return new CandidatesQueryResult
            {
                Candidates = candidates.Select(candidate => new CandidateItem
                {
                    CandidateId = candidate.CandidateId,
                    CandidateName = candidate.CandidateName,
                    Position = candidate.Position,
                    Status = candidate.Status,
                    Archived = candidate.Archived,
                    CreatedDate = candidate.CreatedDate
                }).ToList()
            };
        }
    }
}