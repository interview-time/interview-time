using System.Threading.Tasks;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public interface IInterviewService
    {
        Task UpdateInterview(Interview interview);        

        Task SubmitScorecard(string userId, ScoreCardRequest scoreCard);

        Task<string> ShareScorecard(string userId, string interviewId);

        Task UnshareScorecard(string userId, string interviewId);        
    }
}
