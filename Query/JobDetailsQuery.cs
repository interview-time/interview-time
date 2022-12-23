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
    public class JobDetailsQuery : IRequest<Job>
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string JobId { get; set; }
    }

    public class JobDetailsQueryHandler : IRequestHandler<JobDetailsQuery, Job>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly DynamoDBContext _context;
        private readonly IUserRepository _userRepository;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IInterviewRepository _interviewRepository;

        public JobDetailsQueryHandler(
            IPermissionsService permissionsService,
            IAmazonDynamoDB dynamoDbClient,
            IUserRepository userRepository,
            ICandidateRepository candidateRepository,
            IInterviewRepository interviewRepository)
        {
            _permissionsService = permissionsService;
            _context = new DynamoDBContext(dynamoDbClient);
            _userRepository = userRepository;
            _candidateRepository = candidateRepository;
            _interviewRepository = interviewRepository;
        }

        public async Task<Job> Handle(JobDetailsQuery query, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanViewJobs(query.UserId, query.TeamId))
            {
                throw new AuthorizationException($"User ({query.UserId}) doesn't have permissions to view this job.");
            }

            var job = await _context.LoadAsync<Job>(query.TeamId, query.JobId);
            if (job == null)
            {
                throw new ItemNotFoundException($"Job ({query.JobId}) doesn't exist");
            }

            var owner = await _userRepository.GetProfile(job.Owner);
            job.OwnerName = owner.Name;

            var pipelineCandidates = job.Pipeline.Where(p => p.Candidates != null).SelectMany(p => p.Candidates).ToList();
            var candidateIds = pipelineCandidates.Select(c => c.CandidateId).Distinct().ToList();
            var candidates = await _candidateRepository.GetCandidates(query.TeamId, candidateIds);
            var candidatesToRemove = new List<string>();

            foreach (var pipelineCandidate in pipelineCandidates)
            {
                var candidateDetails = candidates.FirstOrDefault(c => c.CandidateId == pipelineCandidate.CandidateId);
                if (candidateDetails != null)
                {
                    pipelineCandidate.Name = candidateDetails.CandidateName ?? $"{candidateDetails.FirstName} {candidateDetails.LastName}";
                    pipelineCandidate.Position = candidateDetails.Position;

                    var candidateInterviews = await _interviewRepository.GetInterviewsByCandidate(pipelineCandidate.CandidateId);

                    if (candidateInterviews.Count() > 0 && candidateInterviews.All(i => i.Status == InterviewStatus.SUBMITTED.ToString()))
                    {
                        pipelineCandidate.Status = CandidateStageStatus.FEEDBACK_AVAILABLE.ToString();
                    }
                    else if (candidateInterviews.Count() > 0 && !candidateInterviews.All(i => i.Status == InterviewStatus.SUBMITTED.ToString()))
                    {
                        pipelineCandidate.Status = CandidateStageStatus.AWAITING_FEEDBACK.ToString();
                    }
                    else if (candidateInterviews.Count() > 0 && !candidateInterviews.All(i => i.Status == InterviewStatus.NEW.ToString()))
                    {
                        pipelineCandidate.Status = CandidateStageStatus.INTERVIEW_SCHEDULED.ToString();
                    }
                    else if (candidateInterviews == null || candidateInterviews.Count() == 0)
                    {
                        pipelineCandidate.Status = CandidateStageStatus.SHCHEDULE_INTERVIEW.ToString();
                    }
                }
                else
                {
                    candidatesToRemove.Add(pipelineCandidate.CandidateId);
                }
            }

            if (candidatesToRemove.Any())
            {
                foreach (var stage in job.Pipeline)
                {
                    if (stage.Candidates != null)
                    {
                        stage.Candidates.RemoveAll(c => candidatesToRemove.Contains(c.CandidateId));
                    }
                }
            }

            return job;
        }
    }
}
