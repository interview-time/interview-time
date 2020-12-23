using System.Collections.Generic;
using CafApi.Models;

namespace CafApi.ViewModel
{
    public class CategoryResponse
    {
        public string CategoryName { get; set; }

        public List<QuestionBank> Questions { get; set; }
    }
}