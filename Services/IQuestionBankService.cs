using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface IQuestionBankService
    {
        Task<Category> GetCategory(string userId, string categoryId);

        Task<List<Category>> GetCategories(string userId);

        Task<List<Category>> GetCategories(string userId, List<QuestionBank> questions);

        Task<Category> AddCategory(string userId, string categoryName);

        Task UpdateCategory(Category category);

        Task DeleteCategory(string userId, string categoryId);        

        Task<List<QuestionBank>> GetQuestions(string userId, string categoryId = null);

        Task<List<QuestionBank>> GetQuestionBank(string userId, string category = null);

        Task DeleteQuestionBank(IEnumerable<QuestionBank> questions);

        Task UpdateQuestionBank(IEnumerable<QuestionBank> questions);

        Task<QuestionBank> AddQuestion(QuestionBank questionBank);

        Task AddQuestions(IEnumerable<QuestionBank> questions);

        Task UpdateQuestion(QuestionBank questionBank);

        Task DeleteQuestion(string userId, string questionId);
    }
}