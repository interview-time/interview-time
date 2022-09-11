using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IChallengeRepository _challengeRepository;
        private readonly IInterviewRepository _interviewRepository;
        private readonly DynamoDBContext _context;

        public InterviewService(IAmazonDynamoDB dynamoDbClient,
            IPermissionsService permissionsService,
            IChallengeRepository challengeRepository,
            IInterviewRepository interviewRepository)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _permissionsService = permissionsService;
            _challengeRepository = challengeRepository;
            _interviewRepository = interviewRepository;
        }

        public async Task<List<Interview>> GetInterviews(string userId, string teamId = null)
        {
            if (teamId != null)
            {
                var teamMember = await _context.LoadAsync<TeamMember>(teamId, userId);
                if (teamMember != null)
                {
                    var team = await _context.LoadAsync<Team>(teamId);
                    if (team != null) // Team admin gets to see all the interviews
                    {
                        var search = _context.FromQueryAsync<Interview>(new QueryOperationConfig()
                        {
                            IndexName = "TeamId-Index",
                            Filter = new QueryFilter(nameof(Interview.TeamId), QueryOperator.Equal, teamId)
                        });
                        var interviews = await search.GetRemainingAsync();

                        // Admin, Hiring Manager and HR can see all interviews conducted by any member of the team
                        if (teamMember.Roles.Any(r => !r.Equals(TeamRole.ADMIN.ToString())
                            && !r.Equals(TeamRole.HIRING_MANAGER.ToString())
                            && !r.Equals(TeamRole.HR.ToString())))
                        {
                            interviews = interviews.Where(i => i.UserId == userId).ToList();
                        }

                        var challenegIds = interviews
                            .Where(t => t.ChallengeIds != null && t.ChallengeIds.Any())
                            .SelectMany(t => t.ChallengeIds)
                            .Distinct()
                            .ToList();

                        var challenges = await _challengeRepository.GetChallenges(teamId, challenegIds);

                        foreach (var interview in interviews)
                        {
                            if (interview.ChallengeIds != null && interview.ChallengeIds.Any())
                            {
                                interview.Challenges = challenges.Where(c => interview.ChallengeIds.Contains(c.ChallengeId)).ToList();
                            }
                        }

                        return interviews;
                    }
                }
            }

            var config = new DynamoDBOperationConfig();

            var myInterviews = await _context.QueryAsync<Interview>(userId, config).GetRemainingAsync();
            myInterviews = myInterviews.Where(i => string.IsNullOrWhiteSpace(i.TeamId)).ToList();

            return myInterviews;
        }

        public async Task<Interview> AddInterview(Interview interview)
        {
            interview.InterviewId = Guid.NewGuid().ToString();
            interview.CreatedDate = DateTime.UtcNow;
            interview.ModifiedDate = DateTime.UtcNow;

            if (interview.Structure != null && interview.Structure.Groups != null)
            {
                foreach (var group in interview.Structure.Groups)
                {
                    group.GroupId = Guid.NewGuid().ToString();
                }
            }

            await _context.SaveAsync(interview);

            return interview;
        }

        public async Task UpdateInterview(Interview interview)
        {
            interview.ModifiedDate = DateTime.UtcNow;

            if (interview.Structure != null && interview.Structure.Groups != null)
            {
                foreach (var group in interview.Structure.Groups)
                {
                    if (string.IsNullOrWhiteSpace(group.GroupId))
                    {
                        group.GroupId = Guid.NewGuid().ToString();
                    }
                }
            }

            await _context.SaveAsync(interview);
        }

        public async Task DeleteInterview(string userId, string interviewId)
        {
            var interview = await _interviewRepository.GetInterview(interviewId);
            if (interview != null)
            {
                var isBelongInTeam = await _permissionsService.IsBelongInTeam(userId, interview.TeamId);
                if (isBelongInTeam)
                {
                    var userRoles = await _permissionsService.GetUserRoles(userId, interview.TeamId);

                    if (PermissionsService.CanDeleteInterview(userRoles, interview.UserId == userId))
                    {
                        await _context.DeleteAsync<Interview>(interview.UserId, interview.InterviewId);
                    }
                }
            }
        }

        public async Task SubmitScorecard(string userId, ScoreCardRequest scoreCard)
        {
            var interview = await _interviewRepository.GetInterview(userId, scoreCard.InterviewId);

            interview.Notes = scoreCard.Notes;
            interview.Decision = scoreCard.Decision;
            interview.Status = scoreCard.Status;
            interview.RedFlags = scoreCard.RedFlags;

            if (scoreCard.QuestionGroups != null)
            {
                foreach (var groupResult in scoreCard.QuestionGroups)
                {
                    var group = interview.Structure.Groups.FirstOrDefault(g => g.GroupId == groupResult.GroupId);
                    group.Notes = groupResult.Notes;
                    group.Assessment = groupResult.Assessment;

                    if (groupResult.Questions != null)
                    {
                        foreach (var questionResult in groupResult.Questions)
                        {
                            var question = group.Questions.FirstOrDefault(q => q.QuestionId == questionResult.QuestionId);
                            question.Assessment = questionResult.Assessment;
                        }
                    }
                }
            }

            await UpdateInterview(interview);
        }

        public async Task<Interview> CloneInterviewAsDemo(string fromUserId, string fromInterviewId, string toUserId, string toTeamId, string toTemplateId)
        {
            var fromInterview = await _interviewRepository.GetInterview(fromUserId, fromInterviewId);

            var interviewDate = DateTime.UtcNow.AddDays(14);

            fromInterview.UserId = toUserId;
            fromInterview.TeamId = toTeamId;
            fromInterview.TemplateId = toTemplateId;
            fromInterview.Status = InterviewStatus.NEW.ToString();
            fromInterview.InterviewDateTime = new DateTime(interviewDate.Year, interviewDate.Month, interviewDate.Day, 10, 00, 00);

            return await AddInterview(fromInterview);
        }

        public async Task<string> ShareScorecard(string userId, string interviewId)
        {
            var interview = await _interviewRepository.GetInterview(userId, interviewId);
            if (interview != null && interview.Status == InterviewStatus.SUBMITTED.ToString())
            {
                if (string.IsNullOrWhiteSpace(interview.Token))
                {
                    interview.Token = StringHelper.GenerateToken();
                }

                interview.IsShared = true;
                interview.ModifiedDate = DateTime.UtcNow;

                await _context.SaveAsync(interview);

                return interview.Token;
            }

            return null;
        }

        public async Task UnshareScorecard(string userId, string interviewId)
        {
            var interview = await _interviewRepository.GetInterview(userId, interviewId);
            if (interview != null)
            {
                interview.IsShared = false;
                interview.ModifiedDate = DateTime.UtcNow;

                await _context.SaveAsync(interview);
            }
        }
    
        public async Task GetEngagementStats()
        {
            var search = _context.ScanAsync<Interview>(
                new List<ScanCondition>
                {
                    new ScanCondition(nameof(Interview.Status), ScanOperator.Equal, InterviewStatus.SUBMITTED.ToString()),
                    new ScanCondition(nameof(Interview.UserId), ScanOperator.NotEqual, "google-oauth2|100613539099514601346")                    
                });

            var interviews = await search.GetRemainingAsync();

            var grouped = from interview in interviews
                          group interview by new { interview.CreatedDate.Month, interview.CreatedDate.Year } into Period
                          orderby Period.Key.Month descending
                          select new
                          {
                              Period = Period.Key,
                              TotalInterviews = Period.Count(),
                              AveragePerUser = Period.GroupBy(p => p.UserId).Average(p => p.Count())
                          };

            var periods = grouped.ToList();

            foreach (var period in periods)
            {
                Console.WriteLine($"\t{period.Period.Year} {CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(period.Period.Month)}: {period.TotalInterviews} {period.AveragePerUser}");
            }
        }
    }
}