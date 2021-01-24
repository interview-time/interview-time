using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public InterviewController(ILogger<InterviewController> logger, IInterviewService interviewService)
        {
            _logger = logger;
            _interviewService = interviewService;
        }

        [HttpGet()]
        public async Task<List<Interview>> Get()
        {
            var interviews = await _interviewService.GetInterviews(UserId);

            return interviews;
        }

        [HttpPost()]
        public async Task<Interview> AddInterview([FromBody] Interview interview)
        {
            interview.UserId = UserId;
            return await _interviewService.AddInterview(interview);
        }

        [HttpPut()]
        public async Task UpdateInterview([FromBody] Interview interview)
        {
            interview.UserId = UserId;
            await _interviewService.UpdateInterview(interview);
        }

        [HttpDelete("{guideId}")]
        public async Task DeleteInterview(string guideId)
        {
            await _interviewService.DeleteInterview(UserId, guideId);
        }

        [HttpPatch("scorecard")]
        public async Task SubmitScoreCard([FromBody] ScoreCardRequest scoreCard)
        {
            await _interviewService.SubmitScorecard(UserId, scoreCard);
        }
    }
}