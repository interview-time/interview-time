using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly DynamoDBContext _context;

        public InterviewService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Interview> GetInterview(string userId, string interviewId)
        {
            return await _context.LoadAsync<Interview>(userId, interviewId);
        }

        public async Task<List<Interview>> GetInterviews(string userId)
        {
            var config = new DynamoDBOperationConfig();

            return await _context.QueryAsync<Interview>(userId, config).GetRemainingAsync();
        }

        public async Task<List<Interview>> GetInterviewsByTemplate(string templateId)
        {
            var config = new DynamoDBOperationConfig
            {
                IndexName = "TemplateId-Index"
            };

            return await _context.QueryAsync<Interview>(templateId, config).GetRemainingAsync();
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

        public async Task<Interview> CloneInterviewAsDemo(string fromUserId, string fromInterviewId, string toUserId, string toTemplateId)
        {
            var fromInterview = await GetInterview(fromUserId, fromInterviewId);

            var interviewDate = DateTime.UtcNow.AddDays(14);

            fromInterview.UserId = toUserId;
            fromInterview.TemplateId = toTemplateId;
            fromInterview.Status = InterviewStatus.NEW.ToString();
            fromInterview.InterviewDateTime = new DateTime(interviewDate.Year, interviewDate.Month, interviewDate.Day, 10, 00, 00);

            return await AddInterview(fromInterview);
        }
    }
}