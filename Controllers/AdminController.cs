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
    [Authorize(Policy = "Admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ILibraryService _libraryService;
        private readonly ILogger<AdminController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public AdminController(ILogger<AdminController> logger, ILibraryService libraryService)
        {
            _logger = logger;
            _libraryService = libraryService;
        }

        [HttpPost("template/library")]
        public async Task<Library> CreateLibraryTemplate([FromBody] TemplateRequest request)
        {
            return await _libraryService.CreateLibraryTemplate(UserId, request);
        }

        [HttpPut("template/library")]
        public async Task UpdateLibraryTemplate([FromBody] TemplateRequest request)
        {
            await _libraryService.UpdateLibraryTemplate(UserId, request);
        }

        [HttpDelete("template/library/{libraryId}")]
        public async Task DeleteLibraryTemplate(string libraryId)
        {
            await _libraryService.DeleteLibraryTemplate(UserId, libraryId);
        }    
    }
}
