using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Models;

namespace CafApi.Services
{
    public class QuestionBankService : IQuestionBankService
    {
        private readonly IGuideService _guideService;
        private readonly DynamoDBContext _context;

        public QuestionBankService(IAmazonDynamoDB dynamoDbClient, IGuideService guideService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _guideService = guideService;
        }

        public async Task<Category> GetCategory(string userId, string categoryId)
        {
            var category = await _context.LoadAsync<Category>(userId, categoryId);

            return category;
        }

        public async Task<List<Category>> GetCategories(string userId)
        {
            var config = new DynamoDBOperationConfig();

            var categories = await _context.QueryAsync<Category>(userId, config).GetRemainingAsync();

            return categories.Where(c => c.IsActive).ToList();
        }

        public async Task<List<Category>> GetCategories(string userId, List<QuestionBank> questions)
        {
            var categories = await GetCategories(userId);
            var categoryNames = questions.GroupBy(q => q.Category).Select(q => q.Key).ToList();

            if (categories == null || categories.Count < categoryNames.Count || questions.Any(q => q.CategoryId == null))
            {
                var newCategories = new List<Category>();

                foreach (var categoryName in categoryNames)
                {
                    // check if there is existing new category
                    var category = categories.FirstOrDefault(c => c.CategoryName == categoryName);
                    if (category == null)
                    {
                        category = await AddCategory(userId, categoryName);
                    }
                    newCategories.Add(category);

                    // update related questions with new CategoryId
                    var categoryQuestions = questions.Where(q => q.Category == categoryName).ToList();
                    foreach (var question in categoryQuestions)
                    {
                        question.CategoryId = category.CategoryId;
                        question.ModifiedDate = DateTime.UtcNow;

                        await UpdateQuestion(question);
                    }
                }

                return newCategories;
            }

            return categories;
        }

        public async Task<Category> AddCategory(string userId, string categoryName)
        {
            var category = new Category
            {
                UserId = userId,
                CategoryName = categoryName,
                CategoryId = Guid.NewGuid().ToString(),
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            await _context.SaveAsync(category);

            return category;
        }

        public async Task UpdateCategory(Category category)
        {
            category.ModifiedDate = DateTime.UtcNow;

            await _context.SaveAsync(category);
        }

        public async Task DeleteCategory(string userId, string categoryId)
        {
            var questions = await GetQuestions(userId, categoryId);
            var guides = await _guideService.GetGuides(userId);

            // remove questions from guides
            foreach (var guide in guides)
            {
                if (guide.Structure?.Groups != null)
                {
                    foreach (var group in guide.Structure?.Groups)
                    {
                        foreach (var question in questions)
                        {
                            if (group.Questions != null)
                            {
                                group.Questions.RemoveAll(q => q.QuestionId.Equals(question.QuestionId));
                            }
                        }
                    }
                    await _context.SaveAsync(guide);
                }
            }

            // delete questions from category           
            var batch = _context.CreateBatchWrite<QuestionBank>();
            batch.AddDeleteItems(questions);
            await batch.ExecuteAsync();

            // delete category
            await _context.DeleteAsync<Category>(userId, categoryId);
        }

        public async Task<List<QuestionBank>> GetQuestions(string userId, string categoryId = null)
        {
            var config = new DynamoDBOperationConfig();

            if (!string.IsNullOrWhiteSpace(categoryId))
            {
                config.QueryFilter = new List<ScanCondition>
                {
                    new ScanCondition("CategoryId", ScanOperator.Equal, categoryId)
                };
            }

            return await _context.QueryAsync<QuestionBank>(userId, config).GetRemainingAsync();
        }

        public async Task<List<QuestionBank>> GetQuestionBank(string userId, string category = null)
        {
            var config = new DynamoDBOperationConfig();

            if (!string.IsNullOrWhiteSpace(category))
            {
                config.QueryFilter = new List<ScanCondition>
                {
                    new ScanCondition("Category", ScanOperator.Equal, category)
                };
            }

            return await _context.QueryAsync<QuestionBank>(userId, config).GetRemainingAsync();
        }

        public async Task DeleteQuestionBank(IEnumerable<QuestionBank> questions)
        {
            var batch = _context.CreateBatchWrite<QuestionBank>();

            batch.AddDeleteItems(questions);

            await batch.ExecuteAsync();
        }

        public async Task UpdateQuestionBank(IEnumerable<QuestionBank> questions)
        {
            foreach (var question in questions)
            {
                question.ModifiedDate = DateTime.UtcNow;
            }

            var batch = _context.CreateBatchWrite<QuestionBank>();

            batch.AddPutItems(questions);

            await batch.ExecuteAsync();
        }

        public async Task<QuestionBank> AddQuestion(QuestionBank questionBank)
        {
            questionBank.QuestionId = Guid.NewGuid().ToString();
            questionBank.CreatedDate = DateTime.UtcNow;
            questionBank.ModifiedDate = DateTime.UtcNow;

            await _context.SaveAsync(questionBank);

            return questionBank;
        }
        public async Task AddQuestions(IEnumerable<QuestionBank> questions)
        {
            foreach (var question in questions)
            {
                question.QuestionId = Guid.NewGuid().ToString();
                question.CreatedDate = DateTime.UtcNow;
                question.ModifiedDate = DateTime.UtcNow;
            }

            var batch = _context.CreateBatchWrite<QuestionBank>();

            batch.AddPutItems(questions);

            await batch.ExecuteAsync();
        }

        public async Task UpdateQuestion(QuestionBank questionBank)
        {
            questionBank.ModifiedDate = DateTime.UtcNow;

            await _context.SaveAsync(questionBank);
        }

        public async Task DeleteQuestion(string userId, string questionId)
        {
            var guides = await _guideService.GetGuides(userId);

            // remove questions from guides
            foreach (var guide in guides)
            {
                if (guide.Structure?.Groups != null)
                {
                    foreach (var group in guide.Structure?.Groups)
                    {
                        if (group.Questions != null)
                        {
                            group.Questions.RemoveAll(q => q.QuestionId.Equals(questionId));
                        }
                    }
                    await _context.SaveAsync(guide);
                }
            }
            await _context.DeleteAsync<QuestionBank>(userId, questionId);
        }
    }
}