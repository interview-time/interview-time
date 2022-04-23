using System;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Utils;

namespace CafApi.Models
{
    [DynamoDBTable("Invite")]
    public class Invite
    {
        [DynamoDBHashKey]
        public string Token { get; set; }

        public string InviteeEmail { get; set; }

        public string Role { get; set; }

        public string TeamId { get; set; }

        public bool IsAccepted { get; set; }

        public string AcceptedBy { get; set; }

        public string InvitedBy { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime ModifiedDate { get; set; }
    }
}