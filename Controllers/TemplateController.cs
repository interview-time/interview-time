using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.ViewModel;
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
        private readonly ITemplateService _templateService;
        private readonly ILibraryService _libraryService;
        private readonly IPermissionsService _permissionsService;
        private readonly IChallengeService _challengeService;
        private readonly ILogger<TemplateController> _logger;
        private readonly string _demoUserId;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public TemplateController(ILogger<TemplateController> logger,
            ITemplateService templateService,
            ILibraryService libraryService,
            IPermissionsService permissionsService,
            IChallengeService challengeService,
            IConfiguration configuration)
        {
            _logger = logger;
            _templateService = templateService;
            _libraryService = libraryService;
            _permissionsService = permissionsService;
            _challengeService = challengeService;

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

            var templates = await _templateService.GetTeamTemplates(UserId, teamId);
            var challenegIds = templates.Where(t => t.ChallengeIds != null && t.ChallengeIds.Any()).SelectMany(t => t.ChallengeIds).Distinct().ToList();

            var challenges = await _challengeService.GetChallenges(teamId, challenegIds);

            foreach (var template in templates)
            {
                if (template.ChallengeIds != null && template.ChallengeIds.Any())
                {
                    template.Challenges = challenges.Where(c => template.ChallengeIds.Contains(c.ChallengeId)).ToList();
                }
            }

            return templates;
        }

        [HttpPost("template")]
        public async Task<Template> CreateTemplate([FromBody] TemplateRequest request)
        {
            return await _templateService.CreateTemplate(UserId, request, UserId == _demoUserId);
        }

        [HttpDelete("template/{templateId}")]
        public async Task DeleteTemplate(string templateId)
        {
            await _templateService.DeleteTemplate(UserId, templateId);
        }

        [HttpPut("template")]
        public async Task UpdateTemplate([FromBody] TemplateRequest request)
        {
            await _templateService.UpdateTemplate(UserId, request);
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