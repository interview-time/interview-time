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
        private readonly IInterviewService _interviewService;
        private readonly ITemplateService _templateService;
        private readonly ILogger<InterviewController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public AdminController(ILogger<InterviewController> logger, IInterviewService interviewService, ITemplateService templateService)
        {
            _logger = logger;
            _interviewService = interviewService;
            _templateService = templateService;
        }

        [HttpPost("template/library")]
        public async Task<Library> CreateLibraryTemplate([FromBody] TemplateRequest request)
        {
            return await _templateService.CreateLibraryTemplate(UserId, request);
        }

        [HttpPut("template/library")]
        public async Task UpdateLibraryTemplate([FromBody] TemplateRequest request)
        {
            await _templateService.UpdateLibraryTemplate(UserId, request);
        }

        [HttpDelete("template/library/{libraryId}")]
        public async Task DeleteLibraryTemplate(string libraryId)
        {
            await _templateService.DeleteLibraryTemplate(UserId, libraryId);
        }

        [HttpPost("interview/demo")]
        public async Task<Interview> AddDemoInterview([FromBody] Interview interview)
        {
            interview.UserId = "DEMO";
            return await _interviewService.AddInterview(interview);
        }

        [HttpPut("interview/demo")]
        public async Task UpdateDemoInterview([FromBody] Interview interview)
        {
            interview.UserId = "DEMO";
            await _interviewService.UpdateInterview(interview);
        }

        [HttpDelete("interview/demo/{interviewId}")]
        public async Task DeleteDemoInterview(string interviewId)
        {
            await _interviewService.DeleteInterview("DEMO", interviewId);
        }
    }
}
