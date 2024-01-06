using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services;
using MediatR;

namespace CafApi.Query
{
    public class ScorecardReportQuery : IRequest<ScorecardReportQueryResult>
    {
        public string Token { get; set; }
    }

    public class ScorecardReportQueryResult
    {
        public string CandidateName { get; set; }

        public string CandidateNotes { get; set; }

        public string Position { get; set; }

        public string InterviewerName { get; set; }

        public DateTime InterviewDateTime { get; set; }

        public DateTime InterviewEndDateTime { get; set; }

        public string InterviewType { get; set; }

        public string Status { get; set; }

        public int Decision { get; set; }

        public string Notes { get; set; }

        public List<RedFlag> RedFlags { get; set; }

        public InterviewStructure Structure { get; set; }

        public List<LiveCodingChallenge> LiveCodingChallenges { get; set; }

        public TakeHomeChallenge TakeHomeChallenge { get; set; }
    }

    public class ChallengeItem
    {
        public string ChallengeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }

    public class ScorecardReportQueryHandler : IRequestHandler<ScorecardReportQuery, ScorecardReportQueryResult>
    {
        private readonly IInterviewRepository _interviewRepository;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IUserRepository _userRepository;

        public ScorecardReportQueryHandler(
            IInterviewRepository interviewRepository,
            ICandidateRepository candidateRepository,
            IUserRepository userRepository)
        {
            _interviewRepository = interviewRepository;
            _candidateRepository = candidateRepository;
            _userRepository = userRepository;
        }

        public async Task<ScorecardReportQueryResult> Handle(ScorecardReportQuery query, CancellationToken cancellationToken)
        {
            var interview = await _interviewRepository.GetSharedScorecard(query.Token);
            if (interview == null)
            {
                throw new ItemNotFoundException($"Report card with id {query.Token} not found");
            }

            var candidate = await _candidateRepository.GetCandidate(interview.TeamId, interview.CandidateId);
            var interviewer = await _userRepository.GetProfile(interview.UserId);

            return new ScorecardReportQueryResult
            {
                CandidateName = candidate?.CandidateName ?? interview.Candidate,
                CandidateNotes = interview.CandidateNotes,
                Position = interview.Position,
                InterviewerName = interviewer.Name,
                InterviewDateTime = interview.InterviewDateTime,
                InterviewEndDateTime = interview.InterviewEndDateTime,
                InterviewType = interview.InterviewType ?? InterviewType.INTERVIEW.ToString(),
                Status = interview.Status,
                Decision = interview.Decision,
                Notes = interview.Notes,
                Structure = interview.Structure,
                RedFlags = interview.RedFlags,
                LiveCodingChallenges = interview.LiveCodingChallenges,
                TakeHomeChallenge = interview.TakeHomeChallenge,
            };
        }
    }
}
