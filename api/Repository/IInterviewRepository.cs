using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface IInterviewRepository
    {
        Task<Interview> GetInterview(string userId, string interviewId);

        Task<Interview> GetInterview(string interviewId);

        Task<List<Interview>> GetInterviewsByTemplate(string templateId);

        Task<List<Interview>> GetInterviewsByCandidate(string candidateId);

        Task<List<Interview>> GetInterviewsByInterviewer(string userId);

        Task<Interview> GetSharedScorecard(string token);

        Task<List<Interview>> GetInterviewsByJob(string jobId);

        Task SaveInterview(Interview interview);

        Task BatchSaveInterviews(List<Interview> interviews);
    }
}
