using System.Collections.Generic;
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
    [Route("interview")]
    public class InterviewController : ControllerBase
    {
        private readonly IInterviewService _interviewService;
        private readonly ILogger<InterviewController> _logger;
        private readonly string _demoUserId;
        
        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public InterviewController(ILogger<InterviewController> logger, IInterviewService interviewService, IConfiguration configuration)
        {
            _logger = logger;
            _interviewService = interviewService;

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