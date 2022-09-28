using System;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;

namespace CafApi.Models
{
    [DynamoDBTable("Team")]
    public class Team
    {
        [DynamoDBHashKey]
        public string TeamId { get; set; }

        public string OwnerId { get; set; }

        public string Name { get; set; }

        public int Seats { get; set; }

        public string Plan { get; set; }

        public string Token { get; set; }

        public AtsIntegration Integration { get; set; }

        public string StripeCustomerId { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime ModifiedDate { get; set; }
    }

    public class AtsIntegration
    {
        public string MergeAccessToken { get; set; }

        public string Status { get; set; }

        public string ATS { get; set; }

        public DateTime? LastSync { get; set; }
    }
}