using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public TemplateController(ILogger<TemplateController> logger, ITemplateService templateService)
        {
            _logger = logger;
            _templateService = templateService;
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
            return await _templateService.CreateTemplate(UserId, request);
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

        [HttpPost("library")]
        [Authorize(Policy = "ManageLibrary")]
        public async Task<Library> CreateLibraryTemplate([FromBody] TemplateRequest request)
        {
            return await _templateService.CreateLibraryTemplate(UserId, request);
        }

        [HttpPut("library")]
        [Authorize(Policy = "ManageLibrary")]
        public async Task UpdateLibraryTemplate([FromBody] TemplateRequest request)
        {
            await _templateService.UpdateLibraryTemplate(UserId, request);
        }

        [HttpDelete("library/{libraryId}")]
        [Authorize(Policy = "ManageLibrary")]
        public async Task DeleteLibraryTemplate(string libraryId)
        {
            await _templateService.DeleteLibraryTemplate(UserId, libraryId);
        }
    }
}