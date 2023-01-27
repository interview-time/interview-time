using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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

        public string Email { get; set; }

        public string Phone { get; set; }

        public string ResumeUrl { get; set; }

        public string LinkedIn { get; set; }

        public string GitHub { get; set; }

        public string Status { get; set; }

        public bool Archived { get; set; }

        public bool IsFromATS { get; set; }

        public bool IsAnonymised { get; set; }

        public string Location { get; set; }

        public List<string> Tags { get; set; }

        public DateTime CreatedDate { get; set; }

        public string JobId { get; set; }

        public string JobTitle { get; set; }

        public string StageId { get; set; }

        public string StageTitle { get; set; }
    }

    public class CandidatesQueryHandler : IRequestHandler<CandidatesQuery, CandidatesQueryResult>
    {
        private readonly ICandidateRepository _candidateRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IJobRepository _jobRepository;

        public CandidatesQueryHandler(ICandidateRepository candidateRepository,
            IPermissionsService permissionsService,
            IInterviewRepository interviewRepository,
            IJobRepository jobRepository)
        {
            _candidateRepository = candidateRepository;
            _permissionsService = permissionsService;
            _interviewRepository = interviewRepository;
            _jobRepository = jobRepository;
        }

        public async Task<CandidatesQueryResult> Handle(CandidatesQuery query, CancellationToken cancellationToken)
        {
            var teamMember = await _permissionsService.IsTeamMember(query.UserId, query.TeamId);
            if (!teamMember.IsTeamMember)
            {
                throw new AuthorizationException($"User ({query.UserId}) cannot view candidates of team ({query.TeamId})");
            }

            List<Candidate> candidates = null;
            List<string> anonymisedCandidateIds = new List<string>();

            // Interviewer can only see candidates they interviewed or will interview
            if (teamMember.Roles.Contains(TeamRole.INTERVIEWER))
            {
                var interviews = await _interviewRepository.GetInterviewsByInterviewer(query.UserId);

                var candidateIds = interviews
                    .Where(i => i.TeamId == query.TeamId && !string.IsNullOrWhiteSpace(i.CandidateId))
                    .Select(i => i.CandidateId)
                    .Distinct()
                    .ToList();

                candidates = await _candidateRepository.GetCandidates(query.TeamId, candidateIds);

                anonymisedCandidateIds = interviews
                   .Where(i => i.TeamId == query.TeamId
                       && !string.IsNullOrWhiteSpace(i.CandidateId)
                       && i.TakeHomeChallenge != null
                       && i.TakeHomeChallenge.IsAnonymised)
                   .Select(i => i.CandidateId)
                   .Distinct()
                   .ToList();
            }
            else // Recruiter or Hiring Manager can see all candidates
            {
                candidates = await _candidateRepository.GetCandidates(query.TeamId);
            }

            var jobs = new List<Job>();
            if (candidates.Any(c => c.JobId != null))
            {
                jobs = await _jobRepository.GetAllJobs(query.TeamId);
            }

            return new CandidatesQueryResult
            {
                Candidates = candidates.Select(candidate => new CandidateItem
                {
                    CandidateId = candidate.CandidateId,
                    CandidateName = anonymisedCandidateIds.Contains(candidate.CandidateId)
                        ? StringHelper.AnonymiseName(candidate.CandidateName)
                        : candidate.CandidateName,
                    Email = !anonymisedCandidateIds.Contains(candidate.CandidateId)
                        ? candidate.Email
                        : null,
                    Phone = !anonymisedCandidateIds.Contains(candidate.CandidateId)
                        ? candidate.Phone
                        : null,
                    Position = candidate.Position,
                    LinkedIn = candidate.LinkedIn,
                    GitHub = candidate.GitHub,
                    Location = candidate.Location,
                    Status = candidate.Status,
                    Archived = candidate.Archived,
                    Tags = candidate.Tags,
                    IsFromATS = !string.IsNullOrWhiteSpace(candidate.MergeId),
                    CreatedDate = candidate.CreatedDate,
                    IsAnonymised = anonymisedCandidateIds.Contains(candidate.CandidateId),
                    JobId = candidate.JobId,
                    JobTitle = jobs.FirstOrDefault(j => j.JobId == candidate.JobId)?.Title,
                    StageId = GetCurrentStage(jobs, candidate.CandidateId, candidate.JobId)?.StageId,
                    StageTitle = GetCurrentStage(jobs, candidate.CandidateId, candidate.JobId)?.Title,
                }).ToList()
            };
        }

        private Stage GetCurrentStage(List<Job> jobs, string candidateId, string jobId)
        {
            return jobs.FirstOrDefault(j => j.JobId == jobId)?
                .Pipeline.FirstOrDefault(s => s.Candidates != null &&
                    s.Candidates.Any(c => c.CandidateId == candidateId));
        }
    }
}
