using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.Demo;
using CafApi.ViewModel;
using MailChimp.Net.Interfaces;
using MailChimp.Net.Models;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CafApi.Command
{
    public class SignUpUserCommand : IRequest<SignUpUserCommandResult>
    {
        public string UserId { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public int TimezoneOffset { get; set; }

        public string Timezone { get; set; }
    }

    public class SignUpUserCommandResult
    {
        public string UserId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Position { get; set; }

        public int TimezoneOffset { get; set; }

        public string Timezone { get; set; }

        public List<TeamItemResponse> Teams { get; set; }

        public string CurrentTeamId { get; set; }
    }

    public class SignUpUserCommandHandler : IRequestHandler<SignUpUserCommand, SignUpUserCommandResult>
    {
        private readonly IUserRepository _userRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IMailChimpManager _mailChimpManager;
        private readonly ILogger<SignUpUserCommandHandler> _logger;
        private readonly DynamoDBContext _context;

        public SignUpUserCommandHandler(
            IUserRepository userRepository,
            ITeamRepository teamRepository,
            IMailChimpManager mailChimpManager,
            ILogger<SignUpUserCommandHandler> logger,
            IAmazonDynamoDB dynamoDbClient)
        {
            _userRepository = userRepository;
            _teamRepository = teamRepository;
            _mailChimpManager = mailChimpManager;
            _logger = logger;
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<SignUpUserCommandResult> Handle(SignUpUserCommand command, CancellationToken cancellationToken)
        {
            var profile = await _userRepository.GetProfile(command.UserId);
            var teams = new List<TeamItemResponse>();

            if (profile == null)
            {
                var team = await _teamRepository.CreateTeam(command.UserId, "Personal Team");
                profile = await _userRepository.CreateProfile(command.UserId, command.Name, command.Email, command.TimezoneOffset, command.Timezone, team.TeamId);

                teams.Add(new TeamItemResponse
                {
                    TeamId = team.TeamId,
                    TeamName = team.Name,
                    Roles = new List<string> { TeamRole.ADMIN.ToString() }
                });

                await PopulateDemoData(command.UserId, team.TeamId, command.Timezone);

                await AddNewUserInMailchimp(command.Email, command.Name);
            }

            return new SignUpUserCommandResult
            {
                UserId = profile.UserId,
                Name = profile.Name,
                Email = profile.Email,
                TimezoneOffset = profile.TimezoneOffset,
                Timezone = profile.Timezone,
                Teams = teams,
                CurrentTeamId = profile.CurrentTeamId
            };
        }

        private async Task PopulateDemoData(string userId, string teamId, string timezone)
        {
            // Templates
            var screeningTemplate = TemplatesDemoData.GetScreeningTemplate(userId, teamId);
            await _context.SaveAsync(screeningTemplate);

            var nodeTemplate = TemplatesDemoData.GetNodeTemplate(userId, teamId);
            await _context.SaveAsync(nodeTemplate);

            var culturalTemplate = TemplatesDemoData.GetCulturalTemplate(userId, teamId);
            await _context.SaveAsync(culturalTemplate);


            // Candidates
            var benCandidate = DemoData.GetBenCandidate(userId, teamId);
            await _context.SaveAsync(benCandidate);

            var johnCandidate = DemoData.GetJohnCandidate(userId, teamId);
            await _context.SaveAsync(johnCandidate);

            var samiCandidate = DemoData.GetSamiCandidate(userId, teamId);
            await _context.SaveAsync(samiCandidate);           


            // Interviews - Ben
            var screeningInterviewBen = InterviewsDemoData.GetCompltedScreeningInterview(userId, teamId, benCandidate.CandidateId, screeningTemplate.TemplateId, timezone);
            await _context.SaveAsync(screeningInterviewBen);


            // Interviews - Sami
            var screeningInterviewSami = InterviewsDemoData.GetCompltedScreeningInterview( userId, teamId, samiCandidate.CandidateId, screeningTemplate.TemplateId, timezone);
            await _context.SaveAsync(screeningInterviewSami);

            var techInterviewSami = InterviewsDemoData.GetCompltedNodeInterview( userId, teamId, samiCandidate.CandidateId, nodeTemplate.TemplateId, timezone);
            await _context.SaveAsync(techInterviewSami);

            var culturalInterviewSami = InterviewsDemoData.GetInterviewFromTemplate( userId, teamId, samiCandidate.CandidateId, culturalTemplate, timezone);
            await _context.SaveAsync(culturalInterviewSami);


            // Interview - John
            var screeningInterviewJohn = InterviewsDemoData.GetCompltedScreeningInterview(userId, teamId, johnCandidate.CandidateId, screeningTemplate.TemplateId, timezone);
            await _context.SaveAsync(screeningInterviewJohn);

            var futureJohnInterview = InterviewsDemoData.GetInterviewFromTemplate( userId, teamId, johnCandidate.CandidateId, nodeTemplate, timezone);
            await _context.SaveAsync(futureJohnInterview);
        }

        private async Task AddNewUserInMailchimp(string email, string name)
        {
            try
            {
                var member = new Member { EmailAddress = email, StatusIfNew = Status.Subscribed };
                member.MergeFields.Add("FNAME", name);
                await _mailChimpManager.Members.AddOrUpdateAsync("43f230a3ba", member);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding user {email} to MailChimp contacts.");
            }
        }
    }
}
