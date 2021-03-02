using System;
using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;

namespace CafApi.Models
{
    [DynamoDBTable("CommunityQuestion")]
    public class CommunityQuestion
    {
        [DynamoDBHashKey]
        public string CategoryId { get; set; }

        [DynamoDBRangeKey]
        public string QuestionId { get; set; }

        public string Question { get; set; }

        public string Difficulty { get; set; }

        public List<string> Tags { get; set; }

        public int Time { get; set; }

        public string Status { get; set; }

        public string ParentQuestionId { get; set; }

        public string AuthorId { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
