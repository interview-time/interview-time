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
    public class MoveCandidateCommand : IRequest
    {
        internal string TeamId { get; set; }

        internal string UserId { get; set; }

        internal string JobId { get; set; }

        public string CandidateId { get; set; }

        public string NewStageId { get; set; }

        public int Position { get; set; }
    }

    public class MoveCandidateCommandHandler : IRequestHandler<MoveCandidateCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IJobRepository _jobRepository;

        public MoveCandidateCommandHandler(
            IPermissionsService permissionsService,
            IJobRepository jobRepository)
        {
            _permissionsService = permissionsService;
            _jobRepository = jobRepository;
        }

        public async Task<Unit> Handle(MoveCandidateCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanManageJobs(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to update a job.");
            }

            var job = await _jobRepository.GetJob(command.TeamId, command.JobId);
            if (job == null)
            {
                throw new ItemNotFoundException($"Job ({command.JobId}) doesn't exist.");
            }

            var candidate = job.Pipeline.Where(p => p.Candidates != null).SelectMany(p => p.Candidates).FirstOrDefault(c => c.CandidateId == command.CandidateId);
            if (candidate == null)
            {
                throw new ItemNotFoundException($"Candidate ({command.CandidateId}) hasn't been added to the job ({command.JobId}) yet.");
            }

            // remove candidate from one stage
            foreach (var stage in job.Pipeline)
            {
                if (stage.Candidates != null)
                {
                    stage.Candidates.RemoveAll(c => c.CandidateId == command.CandidateId);
                }
            }

            // add candidate to another stage
            var newStage = job.Pipeline.FirstOrDefault(p => p.StageId == command.NewStageId);
            if (newStage.Candidates == null)
            {
                newStage.Candidates = new List<StageCandidate>();
            }

            var index = command.Position <= newStage.Candidates.Count() ? command.Position : 0;

            candidate.MovedToStage = DateTime.UtcNow;
            newStage.Candidates.Insert(index, candidate);

            await _jobRepository.SaveJob(job);

            return Unit.Value;
        }
    }
}
