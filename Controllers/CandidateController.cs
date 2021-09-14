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

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public CandidateController(ILogger<CandidateController> logger, ICandidateService candidateService)
        {
            _logger = logger;
            _candidateService = candidateService;
        }

        [HttpGet("{teamId?}")]
        public async Task<List<CandidateResponse>> GetCandidates(string teamId)
        {
            var candidates = await _candidateService.GetCandidates(UserId, teamId);

            return candidates.Select(c => new CandidateResponse
            {
                CandidateId = c.CandidateId,
                CandidateName = c.CandidateName,
                Position = c.Position,
                ResumeUrl = _candidateService.GetDownloadSignedUrl(c.CandidateId, c.ResumeFile),
                LinkedIn = c.LinkedIn,
                GitHub = c.GitHub,
                CodingRepo = c.CodingRepo,
                Status = c.Status
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

        [HttpDelete("{candidateId}")]
        public async Task DeleteCandidate(string candidateId)
        {
            await _candidateService.DeleteCandidate(UserId, candidateId);
        }

        [HttpGet("upload-signed-url/{candidateId}/{filename}")]
        public async Task<string> GetUploadSignedUrl(string candidateId, string filename)
        {
            return await _candidateService.GetUploadSignedUrl(UserId, candidateId, filename);
        }
    }
}