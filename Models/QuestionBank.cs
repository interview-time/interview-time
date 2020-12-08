using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;

namespace CafApi
{
    [DynamoDBTable("QuestionBank")]
    public class QuestionBank
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }

        public string QuestionId { get; set; }

        public string Category { get; set; }

        public string Question { get; set; }

        public List<string> Tags { get; set; }

        public int Time { get; set; }        
    }
}
