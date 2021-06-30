using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public UserController(ILogger<UserController> logger, IInterviewService interviewService, ITemplateService templateService, IUserService userService)
        {
            _logger = logger;
            _interviewService = interviewService;
            _templateService = templateService;
            _userService = userService;
        }

        [HttpPost("setup")]
        public async Task SetupUser(SetupUserRequest request)
        {
            var profile = await _userService.GetProfile(UserId);
            if (profile == null)
            {
                await _userService.CreateProfile(UserId, request.Name, request.Email, request.TimezoneOffset);

                // populate demo data
                string demoUserId = "auth0|60dbf4211c8534006acaf3f1";

                var demoInterviews = await _interviewService.GetInterviews(demoUserId);

                foreach (var interview in demoInterviews)
                {
                    var toTemplate = await _templateService.GetTemplate(UserId, interview.TemplateId);
                    if (toTemplate == null)
                    {
                        await _templateService.CloneTemplate(demoUserId, interview.TemplateId, UserId);
                    }

                    var toInterview = await _interviewService.GetInterview(UserId, interview.InterviewId);
                    if (toInterview == null)
                    {
                        await _interviewService.CloneInterviewAsDemo(demoUserId, interview.InterviewId, UserId);
                    }
                }
            }
        }
    }
}