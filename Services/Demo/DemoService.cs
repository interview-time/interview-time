using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public class DemoService : IDemoService
    {
        private readonly DynamoDBContext _context;

        public DemoService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<List<Candidate>> CreateDemoCandidates(string userId, string teamId)
        {
            var demoCandidates = new List<Candidate>();

            foreach (var candidate in DemoData.Candidates)
            {
                candidate.TeamId = teamId;
                candidate.Owner = userId;
                candidate.IsDemo = true;
                candidate.CandidateId = Guid.NewGuid().ToString();
                candidate.Status = CandidateStatus.NEW.ToString();
                candidate.CreatedDate = DateTime.UtcNow;

                await _context.SaveAsync(candidate);

                demoCandidates.Add(candidate);
            }

            return demoCandidates;
        }
    }
}