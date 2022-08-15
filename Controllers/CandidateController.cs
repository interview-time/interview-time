using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Query;
using CafApi.Repository;
using CafApi.Services;
using CafApi.ViewModel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly ILogger<CandidateController> _logger;
        private readonly ICandidateService _candidateService;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IMediator _mediator;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public CandidateController(ILogger<CandidateController> logger,
            ICandidateService candidateService,
            IInterviewRepository interviewRepository,
            IMediator mediator)
        {
            _logger = logger;
            _candidateService = candidateService;
            _interviewRepository = interviewRepository;
            _mediator = mediator;
        }

        [Obsolete]
        [HttpGet("candidate/{teamId}")]
        public async Task<List<CandidateResponse>> GetCandidatesOld(string teamId)
        {
            var candidates = await _candidateService.GetCandidates(UserId, teamId);

            var candidateInterviews = new Dictionary<string, int>();
            foreach (var candidate in candidates)
            {
                var interviews = await _interviewRepository.GetInterviewsByCandidate(candidate.CandidateId);
                candidateInterviews.Add(candidate.CandidateId, interviews.Count());
            }

            return candidates.Select(c => new CandidateResponse
            {
                CandidateId = c.CandidateId,
                CandidateName = c.CandidateName,
                Position = c.Position,
                ResumeUrl = c.ResumeFile != null ? _candidateService.GetDownloadSignedUrl(c.TeamId, c.CandidateId, c.ResumeFile) : null,
                ResumeFile = c.ResumeFile,
                LinkedIn = c.LinkedIn,
                GitHub = c.GitHub,
                CodingRepo = c.CodingRepo,
                CreatedDate = c.CreatedDate,
                TotalInterviews = candidateInterviews.GetValueOrDefault(c.CandidateId),
                Status = c.Status,
                Archived = c.Archived
            }).ToList();
        }

        [Obsolete]
        [HttpPost("candidate")]
        public async Task<Candidate> CreateCandidate([FromBody] CreateCandidateRequest request)
        {
            var candidate = new Candidate
            {
                TeamId = request.TeamId,
                CandidateName = request.CandidateName,
                Position = request.Position,
                ResumeFile = request.ResumeFile,
                LinkedIn = request.LinkedIn,
                GitHub = request.GitHub,
                CodingRepo = request.CodingRepo
            };

            return await _candidateService.CreateCandidate(UserId, candidate);
        }

        [Obsolete]
        [HttpPut("candidate")]
        public async Task<Candidate> UpdateCandidate([FromBody] Candidate candidate)
        {
            return await _candidateService.UpdateCandidate(UserId, candidate);
        }

        [Obsolete]
        [HttpDelete("candidate/{candidateId}/team/{teamId}")]
        public async Task DeleteCandidate(string candidateId, string teamId)
        {
            await _candidateService.DeleteCandidate(UserId, teamId, candidateId);
        }

        [Obsolete]
        [HttpGet("candidate/upload-signed-url/{teamId}/{candidateId}/{filename}")]
        public async Task<string> GetUploadSignedUrl(string teamId, string candidateId, string filename)
        {
            return await _candidateService.GetUploadSignedUrl(UserId, teamId, candidateId, filename);
        }

        [HttpGet("team/{teamId}/candidates")]
        public async Task<ActionResult<CandidatesQueryResult>> GetCandidates(string teamId)
        {
            try
            {
                return await _mediator.Send(new CandidatesQuery { UserId = UserId, TeamId = teamId });
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized();
            }
        }
    }
}