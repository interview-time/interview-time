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
    [Route("template")]
    public class TemplateController : ControllerBase
    {
        private readonly ITemplateService _templateService;
        private readonly ILogger<TemplateController> _logger;
        private readonly string _demoUserId;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public TemplateController(ILogger<TemplateController> logger, ITemplateService templateService, IConfiguration configuration)
        {
            _logger = logger;
            _templateService = templateService;

            _demoUserId = configuration["DemoUserId"];
        }

        [HttpGet()]
        public async Task<List<Template>> GetTemplates()
        {
            var templates = await _templateService.GetMyTemplates(UserId);

            return templates;
        }

        [HttpPost()]
        public async Task<Template> CreateTemplate([FromBody] TemplateRequest request)
        {
            return await _templateService.CreateTemplate(UserId, request, UserId == _demoUserId);
        }

        [HttpDelete("{templateId}")]
        public async Task DeleteTemplate(string templateId)
        {
            await _templateService.DeleteTemplate(UserId, templateId);
        }

        [HttpPut()]
        public async Task UpdateTemplate([FromBody] TemplateRequest request)
        {
            await _templateService.UpdateTemplate(UserId, request);
        }

        [HttpGet("library")]
        public async Task<List<Library>> GetTemplatesLibrary()
        {
            var templates = await _templateService.GetTemplatesLibrary();

            return templates;
        }

        [HttpPatch("share")]
        public async Task ShareTemplate([FromBody] ShareTemplateRequest request)
        {
            await _templateService.ShareTemplate(UserId, request.TemplateId, request.Share);
        }

        [HttpGet("shared/{token}")]
        public async Task<Template> GetSharedTemplate(string token)
        {
            var template = await _templateService.AddToShared(UserId, token);

            return template;
        }

        [HttpGet("shared")]
        public async Task<List<Template>> GetSharedWithMeTemplates()
        {
            var templates = await _templateService.GetSharedWithMe(UserId);

            return templates;
        }
    }
}