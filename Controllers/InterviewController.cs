using System.Collections.Generic;
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
        private readonly string _userId = "a653da88-78d6-4cad-a24c-33a9d7a87a69";

        public InterviewController(ILogger<InterviewController> logger, IInterviewService interviewService)
        {
            _logger = logger;
            _interviewService = interviewService;
        }

        [HttpGet()]
        public async Task<List<Interview>> Get()
        {
            var interviews = await _interviewService.GetInterviews(_userId);

            return interviews;
        }

        [HttpPost()]
        public async Task<Interview> AddInterview([FromBody] Interview interview)
        {
            interview.UserId = _userId;
            return await _interviewService.AddInterview(interview);
        }

        [HttpPut()]
        public async Task UpdateInterview([FromBody] Interview interview)
        {
            interview.UserId = _userId;
            await _interviewService.UpdateInterview(interview);
        }

        [HttpDelete("{guideId}")]
        public async Task DeleteInterview(string guideId)
        {
            await _interviewService.DeleteInterview(_userId, guideId);
        }

        [HttpPatch("scorecard")]
        public async Task SubmitScoreCard([FromBody] ScoreCardRequest scoreCard)
        {
            await _interviewService.SubmitScorecard(_userId, scoreCard);
        }
    }
}