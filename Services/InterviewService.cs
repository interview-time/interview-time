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
            var config = new DynamoDBOperationConfig();

            return await _context.LoadAsync<Interview>(userId, interviewId);
        }

        public async Task<List<Interview>> GetInterviews(string userId)
        {
            var config = new DynamoDBOperationConfig();

            return await _context.QueryAsync<Interview>(userId, config).GetRemainingAsync();
        }

        public async Task<List<Interview>> GetGuideInterviews(string guideId)
        {
            var config = new DynamoDBOperationConfig
            {
                IndexName = "GuideId-index"
            };

            return await _context.QueryAsync<Interview>(guideId, config).GetRemainingAsync();
        }

        public async Task<Interview> AddInterview(Interview interview)
        {
            interview.InterviewId = Guid.NewGuid().ToString();
            interview.Status = InterviewStatusType.NEW.ToString();

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
            interview.Status = InterviewStatusType.NEW.ToString();

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
            interview.Decison = scoreCard.Decision;
            interview.Status = InterviewStatusType.COMPLETED.ToString();

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
    }
}