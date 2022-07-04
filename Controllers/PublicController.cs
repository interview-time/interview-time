using System.Threading.Tasks;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly ILogger<PublicController> _logger;
        private readonly ITemplateService _templateService;
        private readonly IUserService _userService;
        private readonly IInterviewService _interviewService;
        private readonly ICandidateService _candidateService;

        public PublicController(
            ILogger<PublicController> logger,
            ITemplateService templateService,
            IUserService userService,
            IInterviewService interviewService,
            ICandidateService candidateService)
        {
            _logger = logger;
            _templateService = templateService;
            _userService = userService;
            _interviewService = interviewService;
            _candidateService = candidateService;
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

        [HttpGet("public/scorecard/{token}")]
        public async Task<ActionResult<SharedScorecardResponse>> GetShareScorecard(string token)
        {
            var interview = await _interviewService.GetSharedScorecard(token);
            if (interview == null)
            {
                return NotFound();
            }

            var candidate = await _candidateService.GetCandidate(interview.TeamId, interview.CandidateId);
            var interviewer = await _userService.GetProfile(interview.UserId);

            return new SharedScorecardResponse
            {
                CandidateName = candidate?.CandidateName ?? interview.Candidate,
                CandidateNotes = interview.CandidateNotes,
                Position = interview.Position,
                InterviewerName = interviewer.Name,
                InterviewStartDateTime = interview.InterviewDateTime,
                InterviewEndDateTime = interview.InterviewEndDateTime,
                Status = interview.Status,
                Decision = interview.Decision,
                Notes = interview.Notes,
                Structure = interview.Structure,
                RedFlags = interview.RedFlags
            };
        }
    }
}