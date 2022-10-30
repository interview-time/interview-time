using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Command;
using CafApi.Common;
using CafApi.Models;
using CafApi.Query;
using CafApi.Repository;
using CafApi.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly ILogger<CandidateController> _logger;
        private readonly ICandidateService _candidateService;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IMediator _mediator;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public CandidateController(ILogger<CandidateController> logger,
            ICandidateService candidateService,
            IInterviewRepository interviewRepository,
            IMediator mediator)
        {
            _logger = logger;
            _candidateService = candidateService;
            _interviewRepository = interviewRepository;
            _mediator = mediator;
        }

        [Obsolete]
        [HttpPost("candidate")]
        public async Task<ActionResult<Candidate>> CreateCandidateOld([FromBody] CreateCandidateCommand command)
        {
            try
            {
                command.UserId = UserId;

                return await _mediator.Send(command);
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized();
            }
        }

        [Obsolete]
        [HttpPut("candidate")]
        public async Task<ActionResult> UpdateCandidateOld([FromBody] UpdateCandidateCommand command)
        {
            try
            {
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

        [Obsolete]
        [HttpDelete("candidate/{candidateId}/team/{teamId}")]
        public async Task<ActionResult> DeleteCandidateOld(string candidateId, string teamId)
        {
            try
            {
                var command = new DeleteCandidateCommand
                {
                    TeamId = teamId,
                    UserId = UserId,
                    CandidateId = candidateId
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

        [Obsolete]
        [HttpGet("candidate/upload-signed-url/{teamId}/{candidateId}/{filename}")]
        public async Task<string> GetUploadSignedUrl(string teamId, string candidateId, string filename)
        {
            return await _candidateService.GetUploadSignedUrl(UserId, teamId, candidateId, filename);
        }

        [HttpGet("team/{teamId}/candidates")]
        public async Task<ActionResult<CandidatesQueryResult>> GetCandidates(string teamId)
        {
            try
            {
                return await _mediator.Send(new CandidatesQuery { UserId = UserId, TeamId = teamId });
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized();
            }
        }

        [HttpGet("team/{teamId}/candidate/{candidateId}")]
        public async Task<ActionResult<CandidateDetailsQueryResult>> GetCandidate([FromQuery] bool? shallow, string teamId, string candidateId)
        {
            try
            {
                var query = new CandidateDetailsQuery
                {
                    UserId = UserId,
                    TeamId = teamId,
                    CandidateId = candidateId,
                    IsShallow = shallow ?? false
                };

                return await _mediator.Send(query);
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

        [HttpPost("team/{teamId}/candidate")]
        public async Task<ActionResult<Candidate>> CreateCandidate(string teamId, [FromBody] CreateCandidateCommand command)
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

                return Unauthorized();
            }
        }

        [HttpPut("team/{teamId}/candidate/{candidateId}")]
        public async Task<ActionResult> UpdateCandidate(string teamId, string candidateId, [FromBody] UpdateCandidateCommand command)
        {
            try
            {
                command.UserId = UserId;
                command.TeamId = teamId;
                command.CandidateId = candidateId;

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

        [HttpDelete("team/{teamId}/candidate/{candidateId}")]
        public async Task<ActionResult> DeleteCandidate(string teamId, string candidateId)
        {
            try
            {
                var command = new DeleteCandidateCommand
                {
                    TeamId = teamId,
                    UserId = UserId,
                    CandidateId = candidateId
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

        [HttpPost("team/{teamId}/candidate/{candidateId}/archive")]
        public async Task<ActionResult> ArchiveCandidate(string teamId, string candidateId)
        {
            try
            {
                var command = new ArchiveCandidateCommand
                {
                    UserId = UserId,
                    TeamId = teamId,
                    CandidateId = candidateId,
                    Archieve = true
                };

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
