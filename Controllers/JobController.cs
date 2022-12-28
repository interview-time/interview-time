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
        public async Task<ActionResult<JobsQueryResult>> GetJobs(string teamId)
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

        [HttpGet("team/{teamId}/job/{jobId}")]
        public async Task<ActionResult<Job>> GetJobDetails(string teamId, string jobId)
        {
            try
            {
                return await _mediator.Send(new JobDetailsQuery { UserId = UserId, TeamId = teamId, JobId = jobId });
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);
                return Unauthorized(ex.Message);
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogError(ex, ex.Message);
                return NotFound(ex.Message);
            }
        }

        [HttpPut("team/{teamId}/job/{jobId}")]
        public async Task<ActionResult> UpdateJob(string teamId, string jobId, [FromBody] UpdateJobCommand command)
        {
            try
            {
                command.TeamId = teamId;
                command.JobId = jobId;
                command.UserId = UserId;

                await _mediator.Send(command);

                return Ok();
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);
                return Unauthorized(ex.Message);
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogError(ex, ex.Message);
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("team/{teamId}/job/{jobId}")]
        public async Task<ActionResult> DeleteJob(string teamId, string jobId)
        {
            try
            {
                var command = new DeleteJobCommand
                {
                    TeamId = teamId,
                    UserId = UserId,
                    JobId = jobId
                };

                await _mediator.Send(command);

                return Ok();
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("team/{teamId}/job/{jobId}/add-candidate")]
        public async Task<ActionResult> AddCandidateToJob(string teamId, string jobId, [FromBody] AddCandidateToJobCommand command)
        {
            try
            {
                command.TeamId = teamId;
                command.JobId = jobId;
                command.UserId = UserId;

                await _mediator.Send(command);

                return Ok();
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);
                return Unauthorized(ex.Message);
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogError(ex, ex.Message);
                return NotFound(ex.Message);
            }
            catch (ItemAlreadyExistsException ex)
            {
                _logger.LogError(ex, ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("team/{teamId}/job/{jobId}/move-candidate")]
        public async Task<ActionResult> MoveCandidateToNewStage(string teamId, string jobId, [FromBody] MoveCandidateCommand command)
        {
            try
            {
                command.TeamId = teamId;
                command.JobId = jobId;
                command.UserId = UserId;

                await _mediator.Send(command);

                return Ok();
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);
                return Unauthorized(ex.Message);
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogError(ex, ex.Message);
                return NotFound(ex.Message);
            }
        }
    }
}
