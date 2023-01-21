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
using CafApi.Services;
using CafApi.Services.User;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace CafApi.Command
{
    public class ScheduleInterviewCommand : IRequest<Interview>
    {
        public string UserId { get; set; }

        public string CandidateId { get; set; }

        public string Candidate { get; set; }

        public string CandidateName { get; set; }

        public string CandidateNotes { get; set; }

        public string Position { get; set; }

        public DateTime InterviewDateTime { get; set; }

        public DateTime InterviewEndDateTime { get; set; }

        public string TemplateId { get; set; }

        public List<string> TemplateIds { get; set; }

        public string LibraryId { get; set; }

        public string Status { get; set; }

        public int Decision { get; set; }

        public string Notes { get; set; }

        public List<RedFlag> RedFlags { get; set; }

        public InterviewStructure Structure { get; set; }

        public string TeamId { get; set; }

        public List<string> Interviewers { get; set; }

        public string LinkId { get; set; }

        public string Token { get; set; }

        public bool IsShared { get; set; }

        public string InterviewType { get; set; }

        public List<LiveCodingChallenge> LiveCodingChallenges { get; set; }

        public TakeHomeChallenge TakeHomeChallenge { get; set; }

        public bool SendChallenge { get; set; }

        public List<ChecklistItem> Checklist { get; set; }
    }

    public class ScheduleInterviewCommandHandler : IRequestHandler<ScheduleInterviewCommand, Interview>
    {
        private readonly ICandidateRepository _candidateRepository;
        private readonly IChallengeRepository _challengeRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        private readonly IJobRepository _jobRepository;
        private readonly string _demoUserId;
        private readonly string _appHostUrl;
        private readonly DynamoDBContext _context;

        public ScheduleInterviewCommandHandler(
            ICandidateRepository candidateRepository,
            IChallengeRepository challengeRepository,
            IPermissionsService permissionsService,
            IUserRepository userRepository,
            IEmailService emailService,
            IJobRepository jobRepository,
            IConfiguration configuration,
            IAmazonDynamoDB dynamoDbClient)
        {
            _candidateRepository = candidateRepository;
            _challengeRepository = challengeRepository;
            _permissionsService = permissionsService;
            _userRepository = userRepository;
            _emailService = emailService;
            _jobRepository = jobRepository;
            _demoUserId = configuration["DemoUserId"];
            _appHostUrl = configuration["AppHostUri"];
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Interview> Handle(ScheduleInterviewCommand command, CancellationToken cancellationToken)
        {
            foreach (var interviewerId in command.Interviewers)
            {
                if (!await _permissionsService.IsBelongInTeam(interviewerId, command.TeamId))
                {
                    throw new AuthorizationException($"Interviewer ({interviewerId}) doesn't belong to the team ({command.TeamId})");
                }
            }

            var candidate = await _candidateRepository.GetCandidate(command.TeamId, command.CandidateId);
            if (candidate == null)
            {
                throw new ItemNotFoundException($"Candidate {command.CandidateId} not found");
            }

            // Get current candidate stage in the hiring pipeline
            string stageId = null;
            string stageTitle = null;
            string jobTitle = null;
            if (candidate.JobId != null)
            {
                var job = await _jobRepository.GetJob(command.TeamId, candidate.JobId);
                if (job != null)
                {
                    jobTitle = job.Title;
                    var currentStage = job.Pipeline.FirstOrDefault(s => s.Candidates.Any(c => c.CandidateId == command.CandidateId));
                    if (currentStage != null)
                    {
                        stageId = currentStage.StageId;
                        stageTitle = currentStage.Title;
                    }
                }
            }

            var mainInterview = new Interview
            {
                CandidateId = command.CandidateId,
                Candidate = command.Candidate,
                Position = command.Position,
                InterviewDateTime = command.InterviewDateTime,
                InterviewEndDateTime = command.InterviewEndDateTime,
                TemplateId = command.TemplateId,
                TemplateIds = command.TemplateIds,
                LibraryId = command.LibraryId,
                Status = command.Status,
                Structure = command.Structure,
                TeamId = command.TeamId,
                CreatedBy = command.UserId,
                Interviewers = command.Interviewers,
                InterviewType = command.InterviewType ?? InterviewType.INTERVIEW.ToString(),
                LiveCodingChallenges = command.LiveCodingChallenges,
                TakeHomeChallenge = command.TakeHomeChallenge,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                LinkId = Guid.NewGuid().ToString(),
                IsDemo = command.UserId == _demoUserId, // Demo account
                Checklist = command.Checklist,
                JobId = candidate.JobId,
                JobTitle = jobTitle,
                StageId = stageId,
                StageTitle = stageTitle
            };

            var interviews = new Dictionary<string, Interview>();

            foreach (var interviewerId in command.Interviewers)
            {
                var newInterview = mainInterview.Clone();
                newInterview.UserId = interviewerId;
                newInterview.InterviewId = Guid.NewGuid().ToString();

                // generate ids for every group of questions
                if (newInterview.Structure != null && newInterview.Structure.Groups != null)
                {
                    foreach (var group in newInterview.Structure.Groups)
                    {
                        group.GroupId = Guid.NewGuid().ToString();
                    }
                }

                // Generate share tokens
                if (newInterview.LiveCodingChallenges != null && newInterview.LiveCodingChallenges.Any())
                {
                    foreach (var liveCoding in newInterview.LiveCodingChallenges)
                    {
                        liveCoding.ShareToken = await _challengeRepository.GenerateChallengeToken(newInterview.UserId, newInterview.TeamId, liveCoding.ChallengeId, newInterview.InterviewId);
                    }
                }

                if (newInterview.TakeHomeChallenge != null)
                {
                    newInterview.TakeHomeChallenge.ShareToken = await _challengeRepository.GenerateChallengeToken(newInterview.UserId, newInterview.TeamId, newInterview.TakeHomeChallenge.ChallengeId, newInterview.InterviewId);
                    newInterview.TakeHomeChallenge.Status = command.SendChallenge
                        ? ChallengeStatus.SentToCandidate.ToString()
                        : ChallengeStatus.NotSent.ToString();
                    newInterview.TakeHomeChallenge.SentToCandidateOn = command.SendChallenge ? DateTime.UtcNow : null;
                }

                await _context.SaveAsync(newInterview);

                interviews.Add(interviewerId, newInterview);
            }

            if (command.InterviewType == InterviewType.TAKE_HOME_TASK.ToString())
            {
                if (command.SendChallenge)
                {
                    await SendTakeHomeChallenge(candidate, interviews?.First().Value.TakeHomeChallenge.ShareToken);
                }
            }
            else
            {
                await SendEmailNotifications(mainInterview, interviews);
            }

            return interviews.GetValueOrDefault(command.UserId);
        }

        private async Task SendEmailNotifications(Interview mainInterview, Dictionary<string, Interview> interviews)
        {
            var profiles = await _userRepository.GetUserProfiles(mainInterview.Interviewers);
            foreach (var profile in profiles)
            {
                var interviewId = interviews.GetValueOrDefault(profile.UserId)?.InterviewId;
                await _emailService.SendNewInterviewInvitation(profile.Email, profile.Name, mainInterview.Candidate, mainInterview.InterviewDateTime, mainInterview.InterviewEndDateTime, interviewId, profile.Timezone, mainInterview.TeamId);
            }
        }

        private async Task SendTakeHomeChallenge(Candidate candidate, string shareToken)
        {
            if (string.IsNullOrWhiteSpace(candidate.Email))
            {
                throw new CandidateException($"Candidate doesn't have email");
            }

            var challengePageUrl = UrlHelper.GetChallengePageUrl(_appHostUrl, shareToken);

            await _emailService.SendTakeHomeChallenge(candidate.Email, candidate.CandidateName, challengePageUrl);
        }
    }
}
