using System;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class CreateCandidateCommand : IRequest<Candidate>
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
    }

    public class CreateCandidateCommandHandler : IRequestHandler<CreateCandidateCommand, Candidate>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly DynamoDBContext _context;

        public CreateCandidateCommandHandler(IPermissionsService permissionsService, IAmazonDynamoDB dynamoDbClient)
        {
            _permissionsService = permissionsService;
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Candidate> Handle(CreateCandidateCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.IsBelongInTeam(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't belong to the team ({command.TeamId})");
            }

            var candidate = new Candidate
            {
                TeamId = command.TeamId,
                CandidateId = command.CandidateId ?? Guid.NewGuid().ToString(),
                CandidateName = command.CandidateName,
                Status = CandidateStatus.NEW.ToString(),
                Position = command.Position,
                ResumeFile = command.ResumeFile,
                LinkedIn = command.LinkedIn,
                GitHub = command.GitHub,
                Phone = command.Phone,
                Owner = command.UserId,
                CreatedDate = DateTime.UtcNow
            };

            await _context.SaveAsync(candidate);

            return candidate;
        }
    }
}