using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface ICandidateRepository
    {
        Task<Candidate> GetCandidate(string teamId, string candidateId);
    }
}
