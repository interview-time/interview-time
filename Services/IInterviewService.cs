using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public interface IInterviewService
    {
        Task<Interview> GetInterview(string userId, string interviewId);

        Task<List<Interview>> GetInterviews(string userId);

        Task<List<Interview>> GetGuideInterviews(string guideId);

        Task<Interview> AddInterview(Interview interview);

        Task UpdateInterview(Interview interview);

        Task DeleteInterview(string userId, string interviewId);

        Task SubmitScorecard(string userId, ScoreCardRequest scoreCard);
    }
}