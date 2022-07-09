using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    public class ChallengeController : ControllerBase
    {
        private readonly IChallengeService _challengeService;
        private readonly IPermissionsService _permissionsService;
        private readonly ILogger<ChallengeController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public ChallengeController(IChallengeService challengeService, IPermissionsService permissionsService, ILogger<ChallengeController> logger)
        {
            _challengeService = challengeService;
            _permissionsService = permissionsService;
            _logger = logger;
        }

        [HttpPost("team/{teamId}/challenge")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> CreateChallenge(string teamId, [FromBody] CreateChallengeRequest request)
        {
            if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
            {
                return Unauthorized();
            }

            await _challengeService.CreateChallenge(UserId, teamId, request);

            return Ok();
        }

        [HttpPut("team/{teamId}/challenge/{challengeId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> UpdateChallenge(string teamId, string challengeId, [FromBody] UpdateChallengeRequest request)
        {
            if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
            {
                return Unauthorized();
            }

            if (!await _challengeService.UpdateChallenge(UserId, teamId, challengeId, request))
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpGet("team/{teamId}/challenge/{challengeId}/filename/{filename}/upload")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<SignedUrlResponse>> GetChallengeUploadSignedUrl(string teamId, string challengeId, string filename)
        {
            if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
            {
                return Unauthorized();
            }

            var signedUrl = _challengeService.GetChallengeUploadSignedUrl(teamId, challengeId, filename);

            return new SignedUrlResponse
            {
                Url = signedUrl.Item1,
                Expires = signedUrl.Item2
            };
        }

        [HttpGet("team/{teamId}/challenge/{challengeId}/filename/{filename}/download")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<SignedUrlResponse>> GetChallengeDownloadSignedUrl(string teamId, string challengeId, string filename)
        {
            if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
            {
                return Unauthorized();
            }

            var signedUrl = _challengeService.GetChallengeDownloadSignedUrl(teamId, challengeId, filename);

            return new SignedUrlResponse
            {
                Url = signedUrl.Item1,
                Expires = signedUrl.Item2
            };
        }

        [HttpGet("team/{teamId}/challenge/{challengeId}/interview/{interviewId}/one-time-token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> GetOneTimeToken(string teamId, string challengeId, string interviewId)
        {
            if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
            {
                return Unauthorized();
            }

            var oneTimeToken = await _challengeService.GenerateOneTimeToken(UserId, teamId, challengeId, interviewId);
            if (oneTimeToken == null)
            {
                return NotFound();
            }

            return Ok(oneTimeToken);
        }

        [AllowAnonymous]
        [HttpGet("challenge/{token}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> GetDownloadChallenge(string token)
        {
            var ulr = await _challengeService.UseOneTimeToken(token);
            if (ulr == null)
            {
                return NotFound();
            }

            return Redirect(ulr);
        }
    }
}
