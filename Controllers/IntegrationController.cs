using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Command;
using CafApi.Common;
using CafApi.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    public class IntegrationController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<IntegrationController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public IntegrationController(IMediator mediator, ILogger<IntegrationController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost("team/{teamId}/integration/link-token")]
        public async Task<ActionResult<string>> GetLinkToken(string teamId)
        {
            try
            {
                var query = new LinkTokenQuery
                {
                    UserId = UserId,
                    TeamId = teamId
                };

                var linkToken = await _mediator.Send(query);

                return Ok(linkToken);
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized();
            }
        }

        [HttpPost("team/{teamId}/integration/swap-public-token")]
        public async Task<ActionResult<string>> SwapPublicToken(string teamId, [FromBody] SwapPublicTokenCommand request)
        {
            try
            {
                request.UserId = UserId;
                request.TeamId = teamId;

                await _mediator.Send(request);

                return Ok();
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized();
            }
        }
    }
}