using System;
using System.Collections.Generic;
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
    public class UpdateCandidateCommand : IRequest
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string CandidateId { get; set; }

        public string CandidateName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Position { get; set; }

        public string ResumeFile { get; set; }

        public string LinkedIn { get; set; }

        public string GitHub { get; set; }

        public string Location { get; set; }

        public List<string> Tags { get; set; }
    }

    public class UpdateCandidateCommandHandler : IRequestHandler<UpdateCandidateCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly ICandidateRepository _candidateRepository;
        private readonly DynamoDBContext _context;

        public UpdateCandidateCommandHandler(
            IPermissionsService permissionsService,
            ICandidateRepository candidateRepository,
            IAmazonDynamoDB dynamoDbClient)
        {
            _permissionsService = permissionsService;
            _candidateRepository = candidateRepository;
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Unit> Handle(UpdateCandidateCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanUpdateOrDeleteOrArchiveCandidate(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to update candidate {command.CandidateId}");
            }

            var candidate = await _candidateRepository.GetCandidate(command.TeamId, command.CandidateId);
            if (candidate == null)
            {
                throw new ItemNotFoundException($"Candidate {command.CandidateId} not found");
            }

            candidate.CandidateName = command.CandidateName;
            candidate.Position = command.Position;
            candidate.Email = command.Email;
            candidate.Phone = command.Phone;
            candidate.GitHub = command.GitHub;
            candidate.LinkedIn = command.LinkedIn;
            candidate.ResumeFile = command.ResumeFile;
            candidate.Location = command.Location;
            candidate.Tags = command.Tags;
            candidate.ModifiedDate = DateTime.UtcNow;

            await _context.SaveAsync(candidate);

            return Unit.Value;
        }
    }
}
