using System.Collections.Generic;
using CafApi.Models;

namespace CafApi.ViewModel
{
    public class QuestionResponse
    {
        public Category Category { get; set; }

        public List<QuestionBank> Questions { get; set; }
    }
}
