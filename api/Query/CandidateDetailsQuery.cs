using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Query
{
    public class CandidateDetailsQuery : IRequest<CandidateDetailsQueryResult>
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string CandidateId { get; set; }

        public bool IsShallow { get; set; }
    }

    public class CandidateDetailsQueryResult : CandidateItem
    {
    }

    public class CurrentStage
    {
        public string StageId { get; set; }

        public string Title { get; set; }

        public string Colour { get; set; }

        public string Type { get; set; }

        public string TemplateId { get; set; }

        public string Status { get; set; }
    }

    public class InterviewStage
    {
        public string StageName { get; set; }

        public DateTime? InterviewStartDate { get; set; }

        public string LinkId { get; set; }

        public List<Interview> Interviews { get; set; }
    }

    public class CandidateDetailsQueryHandler : IRequestHandler<CandidateDetailsQuery, CandidateDetailsQueryResult>
    {
        private readonly IUserRepository _userRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IPermissionsService _permissionsService;        
        private readonly IAmazonS3 _s3Client;

        public CandidateDetailsQueryHandler(
            IUserRepository userRepository,
            ITemplateRepository templateRepository,
            ICandidateRepository candidateRepository,
            IInterviewRepository interviewRepository,
            IPermissionsService permissionsService,            
            IAmazonS3 s3Client)
        {
            _userRepository = userRepository;
            _templateRepository = templateRepository;
            _candidateRepository = candidateRepository;
            _interviewRepository = interviewRepository;
            _permissionsService = permissionsService;            

            _s3Client = s3Client;
        }

        public async Task<CandidateDetailsQueryResult> Handle(CandidateDetailsQuery query, CancellationToken cancellationToken)
        {
            var (isTeamMember, roles) = await _permissionsService.IsTeamMember(query.UserId, query.TeamId);
            if (!isTeamMember)
            {
                throw new AuthorizationException($"User ({query.UserId}) cannot view candidate details ({query.CandidateId})");
            }

            var candidate = await _candidateRepository.GetCandidate(query.TeamId, query.CandidateId);
            if (candidate == null)
            {
                throw new ItemNotFoundException($"Candidate {query.CandidateId} not found");
            }

            var interviews = await _interviewRepository.GetInterviewsByCandidate(query.CandidateId);

            var isInterviewer = interviews.Any(i => i.UserId == query.UserId);
            if (!_permissionsService.CanViewCandidate(roles, isInterviewer))
            {
                throw new AuthorizationException($"User ({query.UserId}) cannot view candidate details ({query.CandidateId})");
            }

            var isAnonymised = interviews.Any(i => i.UserId == query.UserId && i.TakeHomeChallenge != null && i.TakeHomeChallenge.IsAnonymised);
           
            if (!query.IsShallow)
            {
                await AssignInterviewerName(interviews);

                // some of the older interviews with one interviewer don't have LinkId so fixing it here
                if (interviews.Any(i => i.LinkId == null))
                {
                    await AssignLinkId(interviews);
                }              
            }

            return new CandidateDetailsQueryResult
            {
                CandidateId = candidate.CandidateId,
                CandidateName = !isAnonymised ? candidate.CandidateName : AnonymiseName(candidate.CandidateName),
                Position = candidate.Position,
                Email = !isAnonymised ? candidate.Email : null,
                Phone = !isAnonymised ? candidate.Phone : null,
                ResumeUrl = !isAnonymised && candidate.ResumeFile != null
                    ? GetDownloadSignedUrl(query.TeamId, query.CandidateId, candidate.ResumeFile)
                    : null,
                LinkedIn = !isAnonymised ? candidate.LinkedIn : null,
                GitHub = !isAnonymised ? candidate.GitHub : null,
                Status = candidate.Status,
                Location = candidate.Location,
                Tags = candidate.Tags,
                Archived = candidate.Archived,                                
                CreatedDate = candidate.CreatedDate,
                IsAnonymised = isAnonymised,                  
            };
        }

        private string GetDownloadSignedUrl(string teamId, string candidateId, string filename)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "interviewtime",
                Key = $"teams/{teamId}/candidates/{candidateId}/{filename}",
                Verb = HttpVerb.GET,
                Expires = DateTime.Now.AddDays(1)
            };

            return _s3Client.GetPreSignedURL(request);
        }

        private string AnonymiseName(string name)
        {
            return $"{name.First()}*****{name.Last()}";
        }

        private async Task AssignLinkId(List<Interview> interviews)
        {
            var interviewsWithoutLink = interviews.Where(i => i.LinkId == null).ToList();

            foreach (var interview in interviewsWithoutLink)
            {
                interview.LinkId = Guid.NewGuid().ToString();
                await _interviewRepository.SaveInterview(interview);
            }
        }

        private async Task AssignInterviewerName(List<Interview> interviews)
        {
            var interviewerIds = interviews.Select(i => i.UserId).Distinct().ToList();
            var profiles = await _userRepository.GetUserProfiles(interviewerIds);

            foreach (var interview in interviews)
            {
                interview.InterviewerName = profiles.FirstOrDefault(p => p.UserId == interview.UserId)?.Name;
            }
        }

        private async Task<List<InterviewStage>> GetStages(List<Interview> interviews)
        {
            var templates = new List<Template>();
            var templatesIds = interviews
                .Where(i => i.TemplateId != null || i.TemplateIds != null)
                .Select(i => i.TemplateIds?.FirstOrDefault() ?? i.TemplateId)
                .Distinct().ToList();

            foreach (var templateId in templatesIds)
            {
                var template = await _templateRepository.GetTemplate(templateId);
                if (template != null)
                {
                    templates.Add(template);
                }
            }

            var stages = interviews
                .GroupBy(i => i.LinkId).Select(ig => new InterviewStage
                {
                    StageName = templates.FirstOrDefault(t => t.TemplateId == (ig.FirstOrDefault()?.TemplateIds?.FirstOrDefault() ?? ig.FirstOrDefault()?.TemplateId))?.Title,
                    LinkId = ig.Key,
                    InterviewStartDate = ig.FirstOrDefault()?.InterviewDateTime,
                    Interviews = ig.ToList()
                }).OrderBy(s => s.InterviewStartDate).ToList();

            return stages;
        }
    }
}
