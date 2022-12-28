using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class CloseJobCommand : IRequest
    {
        public string TeamId { get; set; }

        public string UserId { get; set; }

        public string JobId { get; set; }
    }

    public class CloseJobCommandHandler : IRequestHandler<CloseJobCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IJobRepository _jobRepository;
        private readonly ICandidateRepository _candidateRepository;

        public CloseJobCommandHandler(
            IPermissionsService permissionsService,
            IJobRepository jobRepository,
            ICandidateRepository candidateRepository)
        {
            _permissionsService = permissionsService;
            _jobRepository = jobRepository;
            _candidateRepository = candidateRepository;
        }

        public async Task<Unit> Handle(CloseJobCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanManageJobs(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to update a job.");
            }

            var job = await _jobRepository.GetJob(command.TeamId, command.JobId);
            if (job == null)
            {
                throw new ItemNotFoundException($"Job ({command.JobId}) not found");
            }

            job.Status = JobStatus.CLOSED.ToString();
            job.ModifiedDate = DateTime.UtcNow;

            await _jobRepository.SaveJob(job);

            var candidateIds = job.Pipeline
                .Where(p => p.Candidates != null)
                .SelectMany(p => p.Candidates)
                .Select(c => c.CandidateId)
                .Distinct()
                .ToList();


            var candidates = await _candidateRepository.GetCandidates(command.TeamId, candidateIds);
            foreach (var candidate in candidates)
            {
                candidate.Archived = true;
                candidate.ModifiedDate = DateTime.UtcNow;
                candidate.ModifiedBy = command.UserId;
            }

            await _candidateRepository.UpdateCandidates(candidates);

            return Unit.Value;
        }
    }
}
