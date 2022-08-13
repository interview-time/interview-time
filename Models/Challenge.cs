using System;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;

namespace CafApi.Models
{
    [DynamoDBTable("Challenge")]
    public class Challenge
    {
        [DynamoDBHashKey]
        public string TeamId { get; set; }

        [DynamoDBRangeKey]
        public string ChallengeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }        

        public string FileName { get; set; }

        public string GitHubUrl { get; set; }

        public string CreatedBy { get; set; }

        public string ModifiedBy { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime ModifiedDate { get; set; }
    }
}
