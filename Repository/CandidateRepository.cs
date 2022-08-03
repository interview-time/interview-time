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
    }
}
