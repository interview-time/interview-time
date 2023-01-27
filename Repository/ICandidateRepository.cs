using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface ICandidateRepository
    {
        Task<Candidate> GetCandidate(string teamId, string candidateId);

        Task<List<Candidate>> GetCandidates(string teamId, List<string> candidateIds);

        Task<List<Candidate>> GetCandidates(string teamId);

        Task UpdateCandidates(List<Candidate> candidates);

        Task SaveCandidate(Candidate candidate);
    }
}
