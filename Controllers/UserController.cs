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
            IConfiguration configuration)
        {
            _logger = logger;
            _interviewService = interviewService;
            _templateService = templateService;
            _userService = userService;

            _demoUserId = configuration["DemoUserId"];
        }

        [HttpGet]
        public async Task<Profile> GetUserProfile()
        {
            return await _userService.GetProfile(UserId);
        }

        [HttpPost]
        public async Task<Profile> SetupUser(SetupUserRequest request)
        {
            var profile = await _userService.GetProfile(UserId);
            if (profile == null)
            {
                profile = await _userService.CreateProfile(UserId, request.Name, request.Email, request.TimezoneOffset);

                // populate demo data            
                var demoInterviews = await _interviewService.GetInterviews(_demoUserId);

                foreach (var interview in demoInterviews)
                {
                    var toTemplate = await _templateService.GetTemplate(UserId, interview.TemplateId);
                    if (toTemplate == null)
                    {
                        await _templateService.CloneTemplate(_demoUserId, interview.TemplateId, UserId);
                    }

                    var toInterview = await _interviewService.GetInterview(UserId, interview.InterviewId);
                    if (toInterview == null)
                    {
                        await _interviewService.CloneInterviewAsDemo(_demoUserId, interview.InterviewId, UserId);
                    }
                }
            }

            return profile;
        }
    }
}