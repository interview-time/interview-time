using System;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;

namespace CafApi.Models
{
    [DynamoDBTable("OneTimeLink")]
    public class OneTimeLink
    {
        [DynamoDBHashKey]
        public string Token { get; set; }

        public string TeamId { get; set; }

        public string ChallengeId { get; set; }

        public string InterviewId { get; set; }        

        public bool IsOneTime { get; set; }

        public bool IsExpired { get; set; }

        public string CreatedBy { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime? ModifiedDate { get; set; }
    }
}
