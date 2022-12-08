using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
        private readonly IDemoService _demoService;
        private readonly ILogger<SignUpUserCommandHandler> _logger;

        public SignUpUserCommandHandler(
            IUserRepository userRepository,
            ITeamRepository teamRepository,
            IMailChimpManager mailChimpManager,
            IDemoService demoService,
            ILogger<SignUpUserCommandHandler> logger)
        {
            _userRepository = userRepository;
            _teamRepository = teamRepository;
            _mailChimpManager = mailChimpManager;
            _demoService = demoService;
            _logger = logger;
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
            var candidates = await _demoService.CreateDemoCandidates(userId, teamId);
            var templates = await _demoService.CreateDemoTemplates(userId, teamId);

            foreach (var template in templates)
            {
                await _demoService.CreateDemoInterview(userId, teamId, candidates.FirstOrDefault().CandidateId, template, timezone);
            }
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