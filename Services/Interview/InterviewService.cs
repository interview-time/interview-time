using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Models;
using CafApi.Utils;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly IUserService _userService;
        private readonly DynamoDBContext _context;

        public InterviewService(IAmazonDynamoDB dynamoDbClient, IUserService userService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _userService = userService;
        }

        public async Task<Interview> GetInterview(string userId, string interviewId)
        {
            return await _context.LoadAsync<Interview>(userId, interviewId);
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
                            return interviews.Where(i => i.UserId == userId).ToList();
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

        public async Task<List<Interview>> GetInterviewsByTemplate(string templateId)
        {
            var config = new DynamoDBOperationConfig
            {
                IndexName = "TemplateId-Index"
            };

            return await _context.QueryAsync<Interview>(templateId, config).GetRemainingAsync();
        }

        public async Task<List<Interview>> GetInterviewsByCandidate(string candidateId)
        {
            var searchByCandidate = _context.FromQueryAsync<Interview>(new QueryOperationConfig()
            {
                IndexName = "CandidateId-index",
                Filter = new QueryFilter(nameof(Interview.CandidateId), QueryOperator.Equal, candidateId)
            });
            var interviews = await searchByCandidate.GetRemainingAsync();

            return interviews;
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
            await _context.DeleteAsync<Interview>(userId, interviewId);
        }

        public async Task SubmitScorecard(string userId, ScoreCardRequest scoreCard)
        {
            var interview = await GetInterview(userId, scoreCard.InterviewId);

            interview.Notes = scoreCard.Notes;
            interview.Decision = scoreCard.Decision;
            interview.Status = scoreCard.Status;

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
            var fromInterview = await GetInterview(fromUserId, fromInterviewId);

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
            var interview = await GetInterview(userId, interviewId);
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
            var interview = await GetInterview(userId, interviewId);
            if (interview != null)
            {
                interview.IsShared = false;
                interview.ModifiedDate = DateTime.UtcNow;

                await _context.SaveAsync(interview);
            }
        }

        public async Task<Interview> GetSharedScorecard(string token)
        {
            var config = new DynamoDBOperationConfig
            {
                IndexName = "Token-index"
            };

            var queryResult = await _context.QueryAsync<Interview>(token, config).GetRemainingAsync();
            var interview = queryResult.FirstOrDefault(i => i.IsShared);

            return interview;
        }
    }
}