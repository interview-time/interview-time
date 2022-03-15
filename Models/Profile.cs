using System;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Utils;

namespace CafApi.Models
{
    [DynamoDBTable("Profile")]
    public class Profile
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public int TimezoneOffset { get; set; }

        public string Timezone { get; set; }

        public string CurrentTeamId { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime ModifiedDate { get; set; }
    }
}