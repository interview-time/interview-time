using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
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

            var teams = await _teamService.GetTeams(profile.Teams);

            return new ProfileResponse
            {
                UserId = profile.UserId,
                Name = profile.Name,
                Email = profile.Email,
                TimezoneOffset = profile.TimezoneOffset,
                Teams = teams.Select(t => new TeamResponse
                {
                    TeamId = t.TeamId,
                    TeamName = t.Name,
                    Token = t.Token,
                    Role = t.OwnerId == UserId ? "ADMIN" : "MEMBER"
                }).ToList()
            };
        }

        [HttpPost]
        public async Task<Profile> SetupUser(SetupUserRequest request)
        {
            var profile = await _userService.GetProfile(UserId);
            if (profile == null)
            {
                profile = await _userService.CreateProfile(UserId, request.Name, request.Email, request.TimezoneOffset);
                var team = await _teamService.CreateTeam(UserId, "My Team");

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
            }

            return profile;
        }
    }
}