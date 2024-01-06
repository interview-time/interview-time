using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Command;
using CafApi.Common;
using CafApi.Models;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.ViewModel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    public class TemplateController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ITemplateService _templateService;
        private readonly ILibraryService _libraryService;
        private readonly IPermissionsService _permissionsService;
        private readonly ILogger<TemplateController> _logger;
        private readonly string _demoUserId;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public TemplateController(IMediator mediator,
            ILogger<TemplateController> logger,
            ITemplateService templateService,
            ILibraryService libraryService,
            IPermissionsService permissionsService,
            IConfiguration configuration)
        {
            _mediator = mediator;
            _logger = logger;
            _templateService = templateService;
            _libraryService = libraryService;
            _permissionsService = permissionsService;

            _demoUserId = configuration["DemoUserId"];
        }

        [Obsolete]
        [HttpGet("template/{teamId?}")]
        public async Task<ActionResult<List<Template>>> GetTemplatesLegacy(string teamId = null)
        {
            if (teamId != null)
            {
                if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
                {
                    return Unauthorized();
                }

                return await _templateService.GetTeamTemplates(UserId, teamId);
            }

            return await _templateService.GetMyTemplates(UserId);
        }

        [HttpGet("team/{teamId}/templates")]
        public async Task<ActionResult<List<Template>>> GetTemplates(string teamId)
        {
            if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
            {
                return Unauthorized();
            }

            return await _templateService.GetTeamTemplates(UserId, teamId);
        }

        [Obsolete]
        [HttpPost("template")]
        public async Task<ActionResult<Template>> CreateTemplateOld([FromBody] CreateTemplateCommand command)
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

        [HttpPost("team/{teamId}/template")]
        public async Task<ActionResult<Template>> CreateTemplate(string teamId, [FromBody] CreateTemplateCommand command)
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

        [Obsolete]
        [HttpPut("template")]
        public async Task<ActionResult> UpdateTemplateOld([FromBody] UpdateTemplateCommand request)
        {
            try
            {
                request.UserId = UserId;

                await _mediator.Send(request);

                return Ok();
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized();
            }
        }

        [HttpPut("team/{teamId}/template")]
        public async Task<ActionResult> UpdateTemplate(string teamId, [FromBody] UpdateTemplateCommand request)
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

        [HttpDelete("template/{templateId}")]
        public async Task DeleteTemplate(string templateId)
        {
            await _templateService.DeleteTemplate(UserId, templateId);
        }

        [HttpGet("template/library")]
        public async Task<List<Library>> GetTemplatesLibrary()
        {
            var templates = await _libraryService.GetTemplatesLibrary();

            return templates;
        }

        [HttpPatch("template/share")]
        public async Task ShareTemplate([FromBody] ShareTemplateRequest request)
        {
            await _templateService.ShareTemplate(UserId, request.TemplateId, request.Share);
        }

        [HttpGet("template/shared")]
        public async Task<List<Template>> GetSharedWithMeTemplates()
        {
            var templates = await _templateService.GetSharedWithMe(UserId);

            return templates;
        }
    }
}