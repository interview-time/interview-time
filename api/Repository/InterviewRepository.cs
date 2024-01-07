using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Models;

namespace CafApi.Repository
{
    public class InterviewRepository : IInterviewRepository
    {
        private readonly DynamoDBContext _context;

        public InterviewRepository(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Interview> GetInterview(string userId, string interviewId)
        {
            return await _context.LoadAsync<Interview>(userId, interviewId);
        }

        public async Task<Interview> GetInterview(string interviewId)
        {
            var search = _context.FromQueryAsync<Interview>(new QueryOperationConfig()
            {
                IndexName = "InterviewId-index",
                Filter = new QueryFilter(nameof(Interview.InterviewId), QueryOperator.Equal, interviewId)
            });
            var interviews = await search.GetRemainingAsync();

            return interviews.FirstOrDefault();
        }

        public async Task<List<Interview>> GetInterviewsByTemplate(string templateId)
        {
            var config = new DynamoDBOperationConfig
            {
                IndexName = "TemplateId-index"
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

        public async Task<List<Interview>> GetInterviewsByInterviewer(string userId)
        {
            return await _context.QueryAsync<Interview>(userId, new DynamoDBOperationConfig()).GetRemainingAsync();
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

        public async Task SaveInterview(Interview interview)
        {
            await _context.SaveAsync(interview);
        }

        public async Task BatchSaveInterviews(List<Interview> interviews)
        {
            if (interviews == null || !interviews.Any())
            {
                return;
            }

            var interviewsBatch = _context.CreateBatchWrite<Interview>();
            interviewsBatch.AddPutItems(interviews);
            await interviewsBatch.ExecuteAsync();
        }
    }
}
