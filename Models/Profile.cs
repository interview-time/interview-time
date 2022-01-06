using System;
using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;

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

        public List<UserTeam> Teams { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }
    }

    public class UserTeam
    {
        public string TeamId { get; set; }

        public List<string> Roles { get; set; }
    }
}