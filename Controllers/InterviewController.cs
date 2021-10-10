using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.Utils;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("interview")]
    public class InterviewController : ControllerBase
    {
        private readonly IInterviewService _interviewService;
        private readonly IUserService _userService;
        private readonly ILogger<InterviewController> _logger;
        private readonly string _demoUserId;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public InterviewController(ILogger<InterviewController> logger,
            IInterviewService interviewService,
            IUserService userService,
            IConfiguration configuration)
        {
            _logger = logger;
            _interviewService = interviewService;
            _userService = userService;

            _demoUserId = configuration["DemoUserId"];
        }

        [HttpGet("{teamId?}")]
        public async Task<List<Interview>> Get(string teamId = null)
        {
            var interviews = await _interviewService.GetInterviews(UserId, teamId);

            return interviews;
        }

        [HttpPost()]
        public async Task<Interview> AddInterview([FromBody] Interview interview)
        {
            if (interview.Interviewers != null && interview.Interviewers.Any() && !string.IsNullOrWhiteSpace(interview.TeamId))
            {
                Interview mainInterview = null;
                foreach (var interviewer in interview.Interviewers)
                {
                    var isBelongInTeam = await _userService.IsBelongInTeam(interviewer, interview.TeamId);
                    if (isBelongInTeam)
                    {
                        var newInterview = interview.Clone();
                        newInterview.UserId = interviewer;

                        newInterview = await _interviewService.AddInterview(newInterview);
                        if (newInterview.UserId == UserId)
                        {
                            mainInterview = newInterview;
                        }
                    }
                }

                return mainInterview;
            }

            interview.UserId = UserId;
            if (UserId == _demoUserId)
            {
                interview.IsDemo = true;
            }

            return await _interviewService.AddInterview(interview);
        }

        [HttpPut()]
        public async Task UpdateInterview([FromBody] Interview interview)
        {          
            interview.UserId = UserId;
            if (UserId == _demoUserId)
            {
                interview.IsDemo = true;
            }

            await _interviewService.UpdateInterview(interview);
        }

        [HttpDelete("{interviewId}")]
        public async Task DeleteInterview(string interviewId)
        {
            await _interviewService.DeleteInterview(UserId, interviewId);
        }

        [HttpPatch("scorecard")]
        public async Task SubmitScoreCard([FromBody] ScoreCardRequest scoreCard)
        {
            await _interviewService.SubmitScorecard(UserId, scoreCard);
        }
    }
}