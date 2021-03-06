using System.Collections.Generic;
using CafApi.Models;

namespace CafApi.ViewModel
{
    public class CommunityCategoryQuestionsResponse
    {
        public CommunityCategory Category { get; set; }

        public IEnumerable<CommunityQuestion> Questions { get; set; }
    }
}