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
    [Route("candidate")]
    public class CandidateController : ControllerBase
    {
        private readonly ILogger<CandidateController> _logger;
        private readonly ICandidateService _candidateService;
        private readonly IInterviewService _interviewService;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public CandidateController(ILogger<CandidateController> logger, ICandidateService candidateService, IInterviewService interviewService)
        {
            _logger = logger;
            _candidateService = candidateService;
            _interviewService = interviewService;
        }

        [HttpGet("{teamId}")]
        public async Task<List<CandidateResponse>> GetCandidates(string teamId)
        {
            var candidates = await _candidateService.GetCandidates(UserId, teamId);

            var candidateInterviews = new Dictionary<string, int>();
            foreach (var candidate in candidates)
            {
                var interviews = await _interviewService.GetInterviewsByCandidate(candidate.CandidateId);
                candidateInterviews.Add(candidate.CandidateId, interviews.Count());
            }

            return candidates.Select(c => new CandidateResponse
            {
                CandidateId = c.CandidateId,
                CandidateName = c.CandidateName,
                Position = c.Position,
                ResumeUrl = c.ResumeFile != null ? _candidateService.GetDownloadSignedUrl(c.CandidateId, c.ResumeFile) : null,
                LinkedIn = c.LinkedIn,
                GitHub = c.GitHub,
                CodingRepo = c.CodingRepo,
                CreatedDate = c.CreatedDate,
                TotalInterviews = candidateInterviews.GetValueOrDefault(c.CandidateId),
                Status = c.Status,
                Archived = c.Archived
            }).ToList();
        }

        [HttpPost()]
        public async Task<Candidate> CreateCandidate([FromBody] Candidate candidate)
        {
            return await _candidateService.CreateCandidate(UserId, candidate);
        }

        [HttpPut()]
        public async Task<Candidate> UpdateCandidate([FromBody] Candidate candidate)
        {
            return await _candidateService.UpdateCandidate(UserId, candidate);
        }

        [HttpDelete("{candidateId}/team/{teamId}")]
        public async Task DeleteCandidate(string candidateId, string teamId)
        {
            await _candidateService.DeleteCandidate(UserId, teamId, candidateId);
        }

        [HttpGet("upload-signed-url/{teamId}/{candidateId}/{filename}")]
        public async Task<string> GetUploadSignedUrl(string teamId, string candidateId, string filename)
        {
            return await _candidateService.GetUploadSignedUrl(UserId, teamId, candidateId, filename);
        }
    }
}