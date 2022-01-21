using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface ICandidateService
    {
        Task<List<Candidate>> GetCandidates(string userId, string teamId);

        Task<Candidate> CreateCandidate(string userId, Candidate candidate);

        Task<Candidate> UpdateCandidate(string userId, Candidate updatedCandidate);

        Task DeleteCandidate(string userId, string candidateId);

        Task<string> GetUploadSignedUrl(string userId, string teamId, string candidateId, string filename);        

        string GetDownloadSignedUrl(string candidateId, string filename);
    }
}