using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
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

        public string Location { get; set; }

        public List<string> Tags { get; set; }

        public string JobId { get; set; }

        public string StageId { get; set; }
    }

    public class CreateCandidateCommandHandler : IRequestHandler<CreateCandidateCommand, Candidate>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly ICandidateRepository _candidateRepository;

        public CreateCandidateCommandHandler(IPermissionsService permissionsService, ICandidateRepository candidateRepository)
        {
            _permissionsService = permissionsService;
            _candidateRepository = candidateRepository;
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
                Email = command.Email,
                Owner = command.UserId,
                Location = command.Location,
                Tags = command.Tags,
                CreatedDate = DateTime.UtcNow,
                JobId = command.JobId
            };

            await _candidateRepository.SaveCandidate(candidate);

            return candidate;
        }
    }
}
