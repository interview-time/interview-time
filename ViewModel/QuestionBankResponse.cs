using System.Collections.Generic;
using CafApi.Models;

namespace CafApi.ViewModel
{
    public class QuestionBankResponse
    {
        public List<string> Categories { get; set; }
        
        public List<QuestionBank> Questions { get; set; }
    }
}