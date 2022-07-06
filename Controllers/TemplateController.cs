using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
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
            IChallengeService challengeService,
            IConfiguration configuration)
        {
            _logger = logger;
            _templateService = templateService;
            _libraryService = libraryService;
            _challengeService = challengeService;

            _demoUserId = configuration["DemoUserId"];
        }

        [HttpGet("template/{teamId?}")]
        public async Task<List<Template>> GetTemplates(string teamId = null)
        {
            if (teamId != null)
            {
                return await _templateService.GetTeamTemplates(UserId, teamId);
            }

            return await _templateService.GetMyTemplates(UserId);
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

        [HttpGet("team/{teamId}/challenge/{challengeId}/filename/{filename}/upload")]
        public async Task<ActionResult<SignedUrlResponse>> GetChallengeUploadSignedUrl(string teamId, string challengeId, string filename)
        {
            var signedUrl = await _challengeService.GetChallengeUploadSignedUrl(UserId, teamId, challengeId, filename);

            if (signedUrl == null)
            {
                return NotFound();
            }

            return new SignedUrlResponse
            {
                Url = signedUrl.Value.Item1,
                Expires = signedUrl.Value.Item2
            };
        }

        [HttpGet("team/{teamId}/challenge/{challengeId}/filename/{filename}/download")]
        public async Task<ActionResult<SignedUrlResponse>> GetChallengeDownloadSignedUrl(string teamId, string challengeId, string filename)
        {
            var signedUrl = await _challengeService.GetChallengeDownloadSignedUrl(UserId, teamId, challengeId, filename);

            if (signedUrl == null)
            {
                return NotFound();
            }

            return new SignedUrlResponse
            {
                Url = signedUrl.Value.Item1,
                Expires = signedUrl.Value.Item2
            };
        }
    }
}