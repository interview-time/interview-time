using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace CafApi.Command
{
    public class SubmitSolutionCommand : IRequest
    {
        public string Token { get; set; }

        public List<string> GitHubUrls { get; set; }
    }

    public class SubmitSolutionCommandHandler : IRequestHandler<SubmitSolutionCommand>
    {
        private readonly IEmailService _emailService;
        private readonly IChallengeRepository _challengeRepository;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IUserRepository _userRepository;
        private readonly DynamoDBContext _context;
        private readonly string _appHostUrl;

        public SubmitSolutionCommandHandler(IEmailService emailService,
            IChallengeRepository challengeRepository,
            IInterviewRepository interviewRepository,
            IUserRepository userRepository,
            IAmazonDynamoDB dynamoDbClient,
            IConfiguration configuration)
        {
            _emailService = emailService;
            _challengeRepository = challengeRepository;
            _interviewRepository = interviewRepository;
            _context = new DynamoDBContext(dynamoDbClient);
            _userRepository = userRepository;
            _appHostUrl = configuration["AppHostUri"];
        }

        public async Task<Unit> Handle(SubmitSolutionCommand command, CancellationToken cancellationToken)
        {
            var oneTimeToken = await _challengeRepository.GetOneTimeLink(command.Token);
            if (oneTimeToken == null || oneTimeToken.IsExpired)
            {
                throw new ItemNotFoundException($"There is no one-time link for token ({command.Token})");
            }

            var interview = await _interviewRepository.GetInterview(oneTimeToken.InterviewId);
            if (interview == null || interview.ChallengeDetails == null)
            {
                throw new ItemNotFoundException($"Interview with id ({oneTimeToken.InterviewId}) doesn't exist or challeneg is not selected.");
            }

            interview.ChallengeDetails.SolutionGitHubUrls = command.GitHubUrls;
            interview.ChallengeDetails.Status = ChallengeStatus.Received;
            interview.ChallengeDetails.ReceivedOn = DateTime.UtcNow;
            interview.ModifiedDate = DateTime.UtcNow;

            await _context.SaveAsync(interview);

            // invalidate token
            oneTimeToken.IsExpired = true;
            oneTimeToken.UsedDate = DateTime.UtcNow;
            await _context.SaveAsync(oneTimeToken);

            // send challenge completed notification to all interviewers
            var interviewers = await _userRepository.GetUserProfiles(interview.Interviewers);
            foreach (var interviewer in interviewers)
            {
                var interviewUrl = UrlHelper.GetInterviewPageUrl(_appHostUrl, interview.InterviewId, interview.TeamId);
                await _emailService.SendChallengeCompletedNotification(interviewer.Email, interviewer.Name, interviewUrl);
            }

            return Unit.Value;
        }
    }
}
