using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
using MailChimp.Net;
using MailChimp.Net.Interfaces;
using MailChimp.Net.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IInterviewService _interviewService;
        private readonly ITemplateService _templateService;
        private readonly IUserService _userService;
        private readonly ITeamService _teamService;
        private readonly ILogger<UserController> _logger;
        private readonly IMailChimpManager _mailChimpManager;
        private readonly string _demoUserId;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public UserController(ILogger<UserController> logger,
            IInterviewService interviewService,
            ITemplateService templateService,
            IUserService userService,
            ITeamService teamService,
            IConfiguration configuration)
        {
            _logger = logger;
            _interviewService = interviewService;
            _templateService = templateService;
            _userService = userService;
            _teamService = teamService;
            _mailChimpManager = new MailChimpManager(configuration["MailChimpApiKey"]);

            _demoUserId = configuration["DemoUserId"];
        }

        [HttpGet]
        public async Task<ProfileResponse> GetUserProfile()
        {
            var profile = await _userService.GetProfile(UserId);
            if (profile == null)
            {
                return null;
            }

            List<(Team Team, TeamMember TeamMember)> teams = await _teamService.GetUserTeams(UserId);

            return new ProfileResponse
            {
                UserId = profile.UserId,
                Name = profile.Name,
                Email = profile.Email,
                Position = profile.Position,
                TimezoneOffset = profile.TimezoneOffset,
                CurrentTeamId = profile.CurrentTeamId,
                Teams = teams.Select(t => new TeamResponse
                {
                    TeamId = t.Team.TeamId,
                    TeamName = t.Team.Name,
                    Token = t.Team.Token,
                    Roles = t.TeamMember.Roles
                }).ToList()
            };
        }

        [HttpPost]
        public async Task<ProfileResponse> SetupUser(SetupUserRequest request)
        {
            var profile = await _userService.GetProfile(UserId);
            var teams = new List<TeamResponse>();

            if (profile == null)
            {
                var team = await _teamService.CreateTeam(UserId, "Personal Team");
                profile = await _userService.CreateProfile(UserId, request.Name, request.Email, request.TimezoneOffset, request.Timezone, team.TeamId);

                teams.Add(new TeamResponse
                {
                    TeamId = team.TeamId,
                    TeamName = team.Name,
                    Token = team.Token,
                    Roles = new List<string> { TeamRole.ADMIN.ToString() }
                });

                // populate demo data            
                var demoInterviews = await _interviewService.GetInterviews(_demoUserId);

                foreach (var interview in demoInterviews)
                {
                    var toTemplate = await _templateService.GetTemplate(UserId, interview.TemplateId);
                    if (toTemplate == null)
                    {
                        toTemplate = await _templateService.CloneTemplate(_demoUserId, interview.TemplateId, UserId, team.TeamId);
                    }

                    var toInterview = await _interviewService.GetInterview(UserId, interview.InterviewId);
                    if (toInterview == null)
                    {
                        await _interviewService.CloneInterviewAsDemo(_demoUserId, interview.InterviewId, UserId, team.TeamId, toTemplate.TemplateId);
                    }
                }

                await AddNewUserInMailchimp(request.Email, request.Name);
            }

            return new ProfileResponse
            {
                UserId = profile.UserId,
                Name = profile.Name,
                Email = profile.Email,
                TimezoneOffset = profile.TimezoneOffset,
                Teams = teams,
                CurrentTeamId = profile.CurrentTeamId
            };
        }

        [HttpPut]
        public async Task UpdateUser(UpdateUserRequest request)
        {
            await _userService.UpdateProfile(UserId, request.Name, request.Position, request.TimezoneOffset, request.Timezone);
        }

        [HttpPut("current-team")]
        public async Task UpdateCurrentTeam(UpdateCurrentTeamRequest request)
        {
            await _userService.UpdateCurrentTeam(UserId, request.CurrentTeamId);
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