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

        public async Task UpdateInterview(Interview interview)
        {
            interview.ModifiedDate = DateTime.UtcNow;

            // expire any shared challenges
            if (interview.Status == InterviewStatus.SUBMITTED.ToString())
            {
                var oneTimeLinks = await _challengeRepository.GetOneTimeLinks(interview.InterviewId);
                var linksToExpire = oneTimeLinks.Where(l => !l.IsExpired).ToList();

                foreach (var link in linksToExpire)
                {
                    link.IsExpired = true;
                    link.ModifiedDate = DateTime.UtcNow;

                    await _context.SaveAsync(link);
                }
            }

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