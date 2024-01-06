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
    [Route("scorecard")]
    public class ScorecardController : ControllerBase
    {
        private readonly IInterviewService _interviewService;
        private readonly ILogger<ScorecardController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public ScorecardController(ILogger<ScorecardController> logger, IInterviewService interviewService)
        {
            _logger = logger;
            _interviewService = interviewService;
        }

        [HttpPut()]
        public async Task SubmitScoreCard([FromBody] ScoreCardRequest request)
        {
            await _interviewService.SubmitScorecard(UserId, request);
        }

        [HttpPatch("share")]
        public async Task<ActionResult> ShareScorecard([FromBody] ShareScorecardRequest request)
        {
            var token = await _interviewService.ShareScorecard(UserId, request.InterviewId);
            if (token == null)
            {
                return NotFound("Scorecard is not found or it hasn't been completed");
            }

            return Ok(new
            {
                token = token
            });
        }

        [HttpPatch("unshare")]
        public async Task UnshareScorecard([FromBody] ShareScorecardRequest request)
        {
            await _interviewService.UnshareScorecard(UserId, request.InterviewId);
        }
    }
}