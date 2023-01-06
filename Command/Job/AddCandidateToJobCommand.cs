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

namespace CafApi.Command
{
    public class AddCandidateToJobCommand : IRequest
    {
        internal string TeamId { get; set; }

        internal string UserId { get; set; }

        internal string JobId { get; set; }

        public string CandidateId { get; set; }

        public string StageId { get; set; }
    }

    public class AddCandidateToJobCommandHandler : IRequestHandler<AddCandidateToJobCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IJobRepository _jobRepository;

        public AddCandidateToJobCommandHandler(
            IPermissionsService permissionsService,
            ICandidateRepository candidateRepository,
            IJobRepository jobRepository)
        {
            _permissionsService = permissionsService;
            _candidateRepository = candidateRepository;
            _jobRepository = jobRepository;
        }

        public async Task<Unit> Handle(AddCandidateToJobCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanManageJobs(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to update a job.");
            }

            var job = await _jobRepository.GetJob(command.TeamId, command.JobId);
            if (job == null)
            {
                throw new ItemNotFoundException($"Job ({command.JobId}) doesn't exist");
            }

            if (job.Pipeline.Where(p => p.Candidates != null).SelectMany(p => p.Candidates).Any(c => c.CandidateId == command.CandidateId))
            {
                throw new ItemAlreadyExistsException($"Candidate ({command.CandidateId}) already in the job ({command.JobId}) ");
            }

            var candidate = await _candidateRepository.GetCandidate(command.TeamId, command.CandidateId);
            if (candidate == null)
            {
                throw new ItemNotFoundException($"Candidate {command.CandidateId} not found or you don't have access to it");
            }

            var stage = job.Pipeline.FirstOrDefault(p => p.StageId == command.StageId);
            if (stage == null)
            {
                stage = job.Pipeline.FirstOrDefault();
            }

            if (stage.Candidates == null)
            {
                stage.Candidates = new List<StageCandidate>();
            }

            stage.Candidates.Add(new StageCandidate
            {
                CandidateId = command.CandidateId,
                MovedToStage = DateTime.UtcNow,
                OriginallyAdded = DateTime.UtcNow,
            });

            candidate.JobId = command.JobId;
            
            await _candidateRepository.SaveCandidate(candidate);
            await _jobRepository.SaveJob(job);

            return Unit.Value;
        }
    }
}
