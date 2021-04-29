using System.Collections.Generic;
using CafApi.Models;

namespace CafApi.ViewModel
{
    public class QuestionsResponse
    {
        public List<Category> Categories { get; set; }

        public List<QuestionBank> Questions { get; set; }
    }
}
