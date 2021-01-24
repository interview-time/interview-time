using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface IQuestionBankService
    {
        Task<List<QuestionBank>> GetQuestionBank(string userId, string category);
        
        Task DeleteQuestionBank(IEnumerable<QuestionBank> questions);

        Task<QuestionBank> AddQuestion(QuestionBank questionBank);

        Task UpdateQuestion(QuestionBank questionBank);

        Task DeleteQuestion(string userId, string questionId);
    }
}