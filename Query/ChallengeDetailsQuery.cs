using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using MediatR;

namespace CafApi.Query
{
    public class ChallengeDetailsQuery : IRequest<ChallengeDetailsQueryResult>
    {
        public string Token { get; set; }
    }

    public class ChallengeDetailsQueryResult
    {
        public string Status { get; set; }

        public string Description { get; set; }

        public string DownloadFileUrl { get; set; }

        public string GitHubUrl { get; set; }

        public string CandidateName { get; set; }

        public string Position { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? SolutionSubmittedOn { get; set; }
    }

    public class ChallengeDetailsQueryHandler : IRequestHandler<ChallengeDetailsQuery, ChallengeDetailsQueryResult>
    {
        private readonly IChallengeRepository _challengeRepository;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IInterviewRepository _interviewRepository;

        public ChallengeDetailsQueryHandler(IChallengeRepository challengeRepository,
            ICandidateRepository candidateRepository,
            IInterviewRepository interviewRepository)
        {
            _challengeRepository = challengeRepository;
            _candidateRepository = candidateRepository;
            _interviewRepository = interviewRepository;
        }

        public async Task<ChallengeDetailsQueryResult> Handle(ChallengeDetailsQuery query, CancellationToken cancellationToken)
        {
            var oneTimeToken = await _challengeRepository.GetOneTimeLink(query.Token);
            if (oneTimeToken == null || oneTimeToken.IsExpired)
            {
                throw new ItemNotFoundException($"Token ({query.Token}) not found or expired.");
            }
                        
            var interview = await _interviewRepository.GetInterview(oneTimeToken.InterviewId);

            Candidate candidate = null;
            if (interview.CandidateId != null)
            {
                candidate = await _candidateRepository.GetCandidate(oneTimeToken.TeamId, interview.CandidateId);
            }

            if (interview.InterviewType == InterviewType.LIVE_CODING.ToString())
            {
                var challenge = interview.LiveCodingChallenges.FirstOrDefault(c => c.ChallengeId == oneTimeToken.ChallengeId);

                return new ChallengeDetailsQueryResult
                {
                    Description = challenge.Description,
                    DownloadFileUrl = !string.IsNullOrWhiteSpace(challenge.FileName) ? UrlHelper.GetDownloadChallengekPath(query.Token) : null,
                    GitHubUrl = challenge.GitHubUrl,
                    CandidateName = candidate?.CandidateName ?? interview.Candidate,
                    Position = interview.Position,
                    CreatedDate = oneTimeToken.CreatedDate
                };
            }
            else if (interview.InterviewType == InterviewType.TAKE_HOME_TASK.ToString())
            {
                return new ChallengeDetailsQueryResult
                {
                    Status = interview.TakeHomeChallenge.Status.ToString(),
                    SolutionSubmittedOn = interview.TakeHomeChallenge.SolutionSubmittedOn,
                    Description = interview.TakeHomeChallenge.Description,
                    DownloadFileUrl = !string.IsNullOrWhiteSpace(interview.TakeHomeChallenge.FileName) ? UrlHelper.GetDownloadChallengekPath(query.Token) : null,
                    GitHubUrl = interview.TakeHomeChallenge.GitHubUrl,
                    CandidateName = candidate?.CandidateName ?? interview.Candidate,
                    Position = interview.Position,
                    CreatedDate = oneTimeToken.CreatedDate
                };
            }

            return null;
        }
    }
}