using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Repository
{
    public class CandidateRepository : ICandidateRepository
    {
        private readonly DynamoDBContext _context;

        public CandidateRepository(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Candidate> GetCandidate(string teamId, string candidateId)
        {
            return await _context.LoadAsync<Candidate>(teamId, candidateId);
        }

        public async Task<List<Candidate>> GetCandidates(string teamId, List<string> candidateIds)
        {
            if (candidateIds == null || !candidateIds.Any())
            {
                return new List<Candidate>();
            }

            var candidateBatch = _context.CreateBatchGet<Candidate>();

            foreach (var candidateId in candidateIds)
            {
                candidateBatch.AddKey(teamId, candidateId);
            }

            await candidateBatch.ExecuteAsync();

            return candidateBatch.Results;
        }

        public async Task<List<Candidate>> GetCandidates(string teamId)
        {
            return await _context.QueryAsync<Candidate>(teamId, new DynamoDBOperationConfig()).GetRemainingAsync();
        }

        public async Task UpdateCandidates(List<Candidate> candidates)
        {
            if (candidates == null || !candidates.Any())
            {
                return;
            }

            var candidateBatch = _context.CreateBatchWrite<Candidate>();
            candidateBatch.AddPutItems(candidates);

            await candidateBatch.ExecuteAsync();
        }

        public async Task SaveCandidate(Candidate candidate)
        {
            await _context.SaveAsync(candidate);
        }
    }
}
