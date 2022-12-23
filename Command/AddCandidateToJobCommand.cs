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

namespace CafApi.Command
{
    public class AddCandidateToJobCommand : IRequest
    {
        public string TeamId { get; set; }

        public string UserId { get; set; }

        public string CandidateId { get; set; }

        public string JobId { get; set; }

        public string StageId { get; set; }
    }

    public class AddCandidateToJobCommandHandler : IRequestHandler<AddCandidateToJobCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly ICandidateRepository _candidateRepository;
        private readonly DynamoDBContext _context;

        public AddCandidateToJobCommandHandler(
            IPermissionsService permissionsService,
            ICandidateRepository candidateRepository,
            IAmazonDynamoDB dynamoDbClient)
        {
            _permissionsService = permissionsService;
            _candidateRepository = candidateRepository;
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Unit> Handle(AddCandidateToJobCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanManageJobs(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to update a job.");
            }

            var job = await _context.LoadAsync<Job>(command.TeamId, command.JobId);
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

            await _context.SaveAsync(job);

            return Unit.Value;
        }
    }
}
