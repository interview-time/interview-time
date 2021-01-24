using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface IQuestionBankService
    {
        Task<List<QuestionBank>> GetQuestionBank(string userId, string category);
        
        Task DeleteQuestionBank(string userId, string category);

        Task<QuestionBank> AddQuestion(QuestionBank questionBank);

        Task UpdateQuestion(QuestionBank questionBank);

        Task DeleteQuestion(string userId, string questionId);
    }
}