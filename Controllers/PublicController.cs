using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly ILogger<TemplateController> _logger;
        private readonly ITemplateService _templateService;
        private readonly IUserService _userService;

        public PublicController(ILogger<TemplateController> logger, ITemplateService templateService, IUserService userService)
        {
            _logger = logger;
            _templateService = templateService;
            _userService = userService;
        }

        [HttpGet("template/shared/{token}")]
        public async Task<ActionResult<SharedTemplateResponse>> GetSharedTemplate(string token)
        {
            var template = await _templateService.GetSharedTemplate(token);
            if (template == null)
            {
                return NotFound();
            }

            return new SharedTemplateResponse
            {
                TemplateId = template.TemplateId,
                Title = template.Title,
                Image = template.Image,
                Type = template.Type,
                Description = template.Description,
                Owner = template.Owner,
                Structure = template.Structure
            };
        }

        [HttpGet("library/{id}")]
        public async Task<ActionResult<SharedTemplateResponse>> GetLibraryTemplate(string id)
        {
            var template = await _templateService.GetLibraryTemplate(id);
            if (template == null)
            {
                return NotFound();
            }

            var owner = await _userService.GetProfile(template.UserId);
            return new SharedTemplateResponse
            {
                TemplateId = template.LibraryId,
                Title = template.Title,
                Image = template.Image,
                Type = template.Type,
                Description = template.Description,
                Owner = owner.Name,
                Structure = template.Structure
            };
        }
    }
}