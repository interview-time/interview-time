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

        public string StripeCustomerId { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime ModifiedDate { get; set; }
    }
}