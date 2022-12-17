using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Command;
using CafApi.Common;
using CafApi.Models;
using CafApi.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly ILogger<JobController> _logger;
        private readonly IMediator _mediator;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public JobController(ILogger<JobController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpPost("team/{teamId}/job")]
        public async Task<ActionResult<Job>> CreateJob(string teamId, [FromBody] CreateJobCommand command)
        {
            try
            {
                command.UserId = UserId;
                command.TeamId = teamId;

                return await _mediator.Send(command);
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("team/{teamId}/jobs")]
        public async Task<ActionResult<JobsQueryResult>> Getjobs(string teamId)
        {
            try
            {
                return await _mediator.Send(new JobsQuery { UserId = UserId, TeamId = teamId });
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized(ex.Message);
            }
        }
    }
}
