using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;

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
            var config = new DynamoDBOperationConfig
            {
                QueryFilter = new List<ScanCondition>
                {
                    new ScanCondition("Category", ScanOperator.Equal, category)
                }
            };

            return await _context.QueryAsync<QuestionBank>(userId, config).GetRemainingAsync();
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