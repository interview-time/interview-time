using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface ICommunityService
    {
        Task<List<CommunityCategory>> GetAllCategories();

        Task<CommunityCategory> AddCategory(CommunityCategory category);

        Task UpdateCategory(CommunityCategory category);

        Task<List<CommunityQuestion>> GetQuestions(string categoryId);

        Task<CommunityQuestion> ContributeQuestion(string userId, string questionBankId, string categoryId);

        Task<QuestionBank> DuplicateQuestion(string categoryId, string questionId, string userId, string destinationCategory);

        Task UpdateQuestion(CommunityQuestion question);

        Task<CommunityQuestion> AddQuestion(CommunityQuestion question);

        Task DeleteQuestion(string categoryId, string questionId);
    }
}