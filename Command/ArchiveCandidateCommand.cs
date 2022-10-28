using System;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class ArchiveCandidateCommand : IRequest
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string CandidateId { get; set; }

        public bool Archieve { get; set; }
    }

    public class ArchiveCandidateCommandHandler : IRequestHandler<ArchiveCandidateCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly ICandidateRepository _candidateRepository;
        private readonly DynamoDBContext _context;

        public ArchiveCandidateCommandHandler(
            IPermissionsService permissionsService,
            ICandidateRepository candidateRepository,
            IAmazonDynamoDB dynamoDbClient)
        {
            _permissionsService = permissionsService;
            _candidateRepository = candidateRepository;
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Unit> Handle(ArchiveCandidateCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanUpdateOrDeleteOrArchiveCandidate(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to archive candidate {command.CandidateId}");
            }

            var candidate = await _candidateRepository.GetCandidate(command.TeamId, command.CandidateId);
            if (candidate == null)
            {
                throw new ItemNotFoundException($"Candidate {command.CandidateId} not found");
            }

            candidate.Archived = command.Archieve;
            candidate.ModifiedDate = DateTime.UtcNow;

            await _context.SaveAsync(candidate);

            return Unit.Value;
        }
    }
}
