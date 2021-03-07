using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Services
{
    public class CommunityService : ICommunityService
    {
        private readonly DynamoDBContext _context;

        public CommunityService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<List<CommunityCategory>> GetAllCategories()
        {
            var conditions = new List<ScanCondition>();

            return await _context.ScanAsync<CommunityCategory>(conditions).GetRemainingAsync();
        }

        public async Task<CommunityCategory> AddCategory(CommunityCategory category)
        {
            category.CategoryId = Guid.NewGuid().ToString();
            category.CreatedDate = DateTime.UtcNow;

            await _context.SaveAsync(category);

            return category;
        }

        public async Task UpdateCategory(CommunityCategory category)
        {
            await _context.SaveAsync(category);
        }

        public async Task<List<CommunityQuestion>> GetQuestions(string categoryId)
        {
            return await _context.QueryAsync<CommunityQuestion>(categoryId).GetRemainingAsync();
        }

         public async Task<CommunityQuestion> AddQuestion(CommunityQuestion communityQuestion)
        {
            communityQuestion.QuestionId = Guid.NewGuid().ToString();

            await _context.SaveAsync(communityQuestion);

            return communityQuestion;
        }

        public async Task<CommunityQuestion> ContributeQuestion(string userId, string questionBankId, string categoryId)
        {
            var personalQuestion = await _context.LoadAsync<QuestionBank>(userId, questionBankId);
            if (personalQuestion == null)
            {
                throw new ArgumentException($"Question {questionBankId} not found for user {userId}");
            }

            var communityQuestion = new CommunityQuestion
            {
                CategoryId = categoryId,
                QuestionId = Guid.NewGuid().ToString(),
                Question = personalQuestion.Question,
                Difficulty = personalQuestion.Difficulty,
                Tags = personalQuestion.Tags,
                Time = personalQuestion.Time,
                Status = CommunityQuestionStatusType.APPROVED.ToString(), // TODO: implement approval workflow
                ParentQuestionId = personalQuestion.QuestionId,
                AuthorId = personalQuestion.UserId,
                CreatedDate = DateTime.UtcNow
            };

            await _context.SaveAsync(communityQuestion);

            return communityQuestion;
        }

        public async Task<QuestionBank> DuplicateQuestion(string categoryId, string questionId, string userId, string destinationCategory)
        {
            var communityQuestion = await _context.LoadAsync<QuestionBank>(categoryId, questionId);
            if (communityQuestion == null)
            {
                throw new ArgumentException($"Community question {questionId} not found for category {categoryId}");
            }

            var personalQuestion = new QuestionBank
            {
                UserId = userId,
                QuestionId = Guid.NewGuid().ToString(),
                Category = destinationCategory,
                Question = communityQuestion.Question,
                Difficulty = communityQuestion.Difficulty,
                Tags = communityQuestion.Tags,
                Time = communityQuestion.Time
            };

            await _context.SaveAsync(personalQuestion);

            return personalQuestion;
        }

        public async Task UpdateQuestion(CommunityQuestion question)
        {
            await _context.SaveAsync(question);
        }

        public async Task DeleteQuestion(string categoryId, string questionId)
        {
            await _context.DeleteAsync<CommunityQuestion>(categoryId, questionId);
        }
    }
}