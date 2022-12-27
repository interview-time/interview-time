using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Repository
{
    public class JobRepository : IJobRepository
    {
        private readonly DynamoDBContext _context;

        public JobRepository(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<List<Job>> GetAllJobs(string teamId)
        {
            return await _context.QueryAsync<Job>(teamId, new DynamoDBOperationConfig()).GetRemainingAsync();
        }

        public async Task<Job> GetJob(string teamId, string jobId)
        {
            return await _context.LoadAsync<Job>(teamId, jobId);
        }

        public async Task SaveJob(Job job)
        {
            await _context.SaveAsync(job);
        }
    }
}
