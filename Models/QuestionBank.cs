using System.Collections.Generic;

namespace CafApi
{
    public class QuestionBank
    {
        public string UserId { get; set; }

        public string QuestionId { get; set; }

        public string Category { get; set; }

        public string Question { get; set; }

        public List<string> Tags { get; set; }

        public int Time { get; set; }        
    }
}
