using System;
using Amazon.DynamoDBv2.DataModel;

namespace CafApi.Models
{
    [DynamoDBTable("CommunityCategory")]
    public class CommunityCategory
    {
        [DynamoDBHashKey]
        public string CategoryId { get; set; }

        public string CategoryName { get; set; }

        public string Image { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
