using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Command;
using CafApi.Common;
using CafApi.Query;
using CafApi.Repository;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.ViewModel;
using MediatR;
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
        private readonly IChallengeRepository _challengeRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly ILogger<ChallengeController> _logger;
        private readonly IMediator _mediator;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public ChallengeController(IChallengeService challengeService,
            IChallengeRepository challengeRepository,
            IPermissionsService permissionsService,
            ILogger<ChallengeController> logger,
            IMediator mediator)
        {
            _challengeService = challengeService;
            _challengeRepository = challengeRepository;
            _permissionsService = permissionsService;
            _logger = logger;
            _mediator = mediator;
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

        [HttpGet("team/{teamId}/challenge/{challengeId}/interview/{interviewId}/token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> GetChallengeToken(string teamId, string challengeId, string interviewId)
        {
            if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
            {
                return Unauthorized();
            }

            var challengeToken = await _challengeRepository.GenerateChallengeToken(UserId, teamId, challengeId, interviewId);
            if (challengeToken == null)
            {
                return NotFound();
            }

            return Ok(challengeToken);
        }

        [HttpPost("team/{teamId}/challenge/{challengeId}/send")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> SendChallenge(string teamId, string challengeId, [FromBody] SendChallengeRequest request)
        {
            try
            {
                var command = new SendChallengeCommand
                {
                    UserId = UserId,
                    TeamId = teamId,
                    ChallengeId = challengeId,
                    InterviewId = request.InterviewId,
                    SendVia = request.SendViaLink ? SendVia.Link : SendVia.Email
                };

                var isSent = await _mediator.Send(command);
                if (!isSent)
                {
                    return StatusCode(500);
                }
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogWarning(ex, ex.Message);

                return NotFound(ex.Message);
            }
            catch (AuthorizationException ex)
            {
                _logger.LogWarning(ex, ex.Message);

                return Unauthorized();
            }
            catch (CandidateException ex)
            {
                _logger.LogWarning(ex, ex.Message);

                return BadRequest(ex.Message);
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("challenge/{token}/download")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> DownloadChallenge(string token)
        {
            var ulr = await _challengeService.GetChallengeDirectUrl(token);
            if (ulr == null)
            {
                return NotFound();
            }

            return Redirect(ulr);
        }

        [AllowAnonymous]
        [HttpGet("challenge/{token}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ChallengeDetailsQueryResult>> GetChallengeDetails(string token)
        {
            try
            {
                var result = await _mediator.Send(new ChallengeDetailsQuery { Token = token });

                return Ok(result);
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogWarning(ex, ex.Message);

                return NotFound();
            }
        }

        [AllowAnonymous]
        [HttpPost("challenge/{token}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> SubmitSolution(string token, [FromBody] SubmitSolutionRequest request)
        {
            try
            {
                await _mediator.Send(new SubmitSolutionCommand { Token = token, GitHubUrls = request.GitHubUrls });

                return Ok();
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogWarning(ex, ex.Message);

                return NotFound();
            }
        }
    }
}
