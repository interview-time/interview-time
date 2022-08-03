using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
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
        private readonly string _appHostUrl;

        public SendChallengeCommandHandler(IPermissionsService permissionsService,
            IInterviewRepository interviewRepository,
            IEmailService emailService,
            ICandidateRepository candidateRepository,
            IChallengeRepository challengeRepository,
            IConfiguration configuration)
        {
            _permissionsService = permissionsService;
            _interviewRepository = interviewRepository;
            _emailService = emailService;
            _candidateRepository = candidateRepository;
            _challengeRepository = challengeRepository;

            _appHostUrl = configuration["AppHostUri"];
        }

        public async Task<bool> Handle(SendChallengeCommand request, CancellationToken cancellationToken)
        {
            var interview = await _interviewRepository.GetInterview(request.InterviewId);
            if (interview == null)
            {
                throw new ItemNotFoundException($"Interview {request.InterviewId} not found");
            }

            var isInterviewer = interview.Interviewers?.Any(interviewerId => interviewerId == request.UserId) ?? interview.UserId == request.UserId;

            if (!await _permissionsService.CanSendChallenge(request.UserId, request.TeamId, isInterviewer))
            {
                throw new AuthorizationException($"User {request.UserId} not authorized to send challenge {request.ChallengeId}");
            }

            var candidate = await _candidateRepository.GetCandidate(request.TeamId, interview.CandidateId);
            if (candidate == null || string.IsNullOrWhiteSpace(candidate.Email))
            {
                throw new CandidateException($"Candidate doesn't have email");
            }

            var challengeToken = await _challengeRepository.GenerateChallengeToken(request.UserId, request.TeamId, request.ChallengeId, request.InterviewId);

            var challengePageUrl = UrlHelper.GetChallengePageUrl(_appHostUrl, challengeToken);

            return await _emailService.SendTakeHomeChallenge(candidate.Email, candidate.CandidateName, challengePageUrl);
        }
    }
}
