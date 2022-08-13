using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public interface IInterviewService
    {
        Task<List<Interview>> GetInterviews(string userId, string teamId = null);

        Task<Interview> AddInterview(Interview interview);

        Task UpdateInterview(Interview interview);

        Task DeleteInterview(string userId, string interviewId);

        Task SubmitScorecard(string userId, ScoreCardRequest scoreCard);

        Task<Interview> CloneInterviewAsDemo(string fromUserId, string fromInterviewId, string toUserId, string toTeamId, string toTemplateId);

        Task<string> ShareScorecard(string userId, string interviewId);

        Task UnshareScorecard(string userId, string interviewId);

        Task<Interview> GetSharedScorecard(string token);
    }
}