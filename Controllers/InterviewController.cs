using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.Common;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using CafApi.Repository;
using CafApi.Command;
using MediatR;
using CafApi.Query;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    public class InterviewController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IInterviewService _interviewService;
        private readonly IUserRepository _userRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly ILogger<InterviewController> _logger;
        private readonly IEmailService _emailService;
        private readonly string _demoUserId;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public InterviewController(
            IMediator mediator,
            ILogger<InterviewController> logger,
            IInterviewService interviewService,
            IUserRepository userRepository,
            IConfiguration configuration,
            IEmailService emailService,
            IPermissionsService permissionsService)
        {
            _mediator = mediator;
            _logger = logger;
            _interviewService = interviewService;
            _userRepository = userRepository;
            _emailService = emailService;
            _permissionsService = permissionsService;

            _demoUserId = configuration["DemoUserId"];
        }

        [HttpGet("interview/{teamId?}")]
        public async Task<ActionResult<List<Interview>>> Get(string teamId = null)
        {
            var query = new InterviewsQuery
            {
                TeamId = teamId,
                UserId = UserId
            };

            var result = await _mediator.Send(query);

            return Ok(result.Interviews);
        }

        [HttpPost("interview")]
        public async Task<ActionResult<Interview>> ScheduleInterview([FromBody] ScheduleInterviewCommand command)
        {
            try
            {
                command.UserId = UserId;

                var mainInterview = await _mediator.Send(command);

                return Ok(mainInterview);
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized();
            }
        }

        [HttpPut("interview")]
        public async Task UpdateInterview([FromBody] Interview interview)
        {
            interview.UserId = UserId;
            if (UserId == _demoUserId)
            {
                interview.IsDemo = true;
            }

            await _interviewService.UpdateInterview(interview);
        }

        [HttpDelete("team/{teamId}/interview/{interviewId}")]
        public async Task<ActionResult<Interview>> CancelInterview(string teamId, string interviewId)
        {
            try
            {
                var cancelledInterview = await _mediator.Send(new CancelInterviewCommand
                {
                    UserId = UserId,
                    TeamId = teamId,
                    InterviewId = interviewId
                });

                return Ok(cancelledInterview);
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
        [HttpPatch("interview/scorecard")]
        public async Task SubmitScoreCard([FromBody] ScoreCardRequest scoreCard)
        {
            await _interviewService.SubmitScorecard(UserId, scoreCard);
        }
    }
}