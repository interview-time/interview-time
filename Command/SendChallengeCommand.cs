using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services;
using CafApi.Services.User;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace CafApi.Command
{
    public class SendChallengeCommand : IRequest<bool>
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string ChallengeId { get; set; }

        public string InterviewId { get; set; }
    }

    public class SendChallengeCommandHandler : IRequestHandler<SendChallengeCommand, bool>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IEmailService _emailService;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IChallengeRepository _challengeRepository;
        private readonly DynamoDBContext _context;
        private readonly string _appHostUrl;

        public SendChallengeCommandHandler(IPermissionsService permissionsService,
            IInterviewRepository interviewRepository,
            IEmailService emailService,
            ICandidateRepository candidateRepository,
            IChallengeRepository challengeRepository,
            IAmazonDynamoDB dynamoDbClient,
            IConfiguration configuration)
        {
            _permissionsService = permissionsService;
            _interviewRepository = interviewRepository;
            _emailService = emailService;
            _candidateRepository = candidateRepository;
            _challengeRepository = challengeRepository;

            _context = new DynamoDBContext(dynamoDbClient);

            _appHostUrl = configuration["AppHostUri"];
        }

        public async Task<bool> Handle(SendChallengeCommand command, CancellationToken cancellationToken)
        {
            var interview = await _interviewRepository.GetInterview(command.InterviewId);
            if (interview == null)
            {
                throw new ItemNotFoundException($"Interview {command.InterviewId} not found");
            }

            var isInterviewer = interview.Interviewers?.Any(interviewerId => interviewerId == command.UserId) ?? interview.UserId == command.UserId;

            if (!await _permissionsService.CanSendChallenge(command.UserId, command.TeamId, isInterviewer))
            {
                throw new AuthorizationException($"User {command.UserId} not authorized to send challenge {command.ChallengeId}");
            }

            var candidate = await _candidateRepository.GetCandidate(command.TeamId, interview.CandidateId);
            if (candidate == null || string.IsNullOrWhiteSpace(candidate.Email))
            {
                throw new CandidateException($"Candidate doesn't have email");
            }

            // Save selected challenge
            interview.ChallengeDetails = new ChallengeDetails
            {
                ChallengeId = command.ChallengeId,
                Status = ChallengeStatus.Sent,
                SentOn = DateTime.UtcNow
            };
            interview.ModifiedDate = DateTime.UtcNow;
            
            await _context.SaveAsync(interview);

            var challengeToken = await _challengeRepository.GenerateChallengeToken(command.UserId, command.TeamId, command.ChallengeId, command.InterviewId);
            var challengePageUrl = UrlHelper.GetChallengePageUrl(_appHostUrl, challengeToken);

            return await _emailService.SendTakeHomeChallenge(candidate.Email, candidate.CandidateName, challengePageUrl);
        }
    }
}
