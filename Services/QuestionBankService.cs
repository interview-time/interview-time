using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Models;

namespace CafApi.Services
{
    public class QuestionBankService : IQuestionBankService
    {
        private readonly DynamoDBContext _context;

        public QuestionBankService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<List<QuestionBank>> GetQuestionBank(string userId, string category)
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
            var batch = _context.CreateBatchWrite<QuestionBank>();
            
            batch.AddPutItems(questions);

            await batch.ExecuteAsync();
        }

        public async Task<QuestionBank> AddQuestion(QuestionBank questionBank)
        {
            questionBank.QuestionId = Guid.NewGuid().ToString();

            await _context.SaveAsync(questionBank);

            return questionBank;
        }

        public async Task UpdateQuestion(QuestionBank questionBank)
        {
            await _context.SaveAsync(questionBank);
        }

        public async Task DeleteQuestion(string userId, string questionId)
        {
            await _context.DeleteAsync<QuestionBank>(userId, questionId);
        }
    }
}