using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Query;
using CafApi.Services;
using CafApi.ViewModel;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly ILogger<PublicController> _logger;
        private readonly ITemplateService _templateService;
        private readonly ILibraryService _libraryService;
        private readonly IUserService _userService;
        private readonly IMediator _mediator;

        public PublicController(
            ILogger<PublicController> logger,
            ITemplateService templateService,
            ILibraryService libraryService,
            IUserService userService,
            IMediator mediator)
        {
            _logger = logger;
            _templateService = templateService;
            _libraryService = libraryService;
            _userService = userService;
            _mediator = mediator;
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
            var template = await _libraryService.GetLibraryTemplate(id);
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

        [HttpGet("public/scorecard/{token}")]
        public async Task<ActionResult<SharedScorecardResponse>> GetShareScorecardReport(string token)
        {
            try
            {
                var result = await _mediator.Send(new ScorecardReportQuery { Token = token });

                return Ok(result);
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogError(ex, ex.Message);

                return NotFound();
            }
        }
    }
}