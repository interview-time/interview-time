using System;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Utils;

namespace CafApi.Models
{
    [DynamoDBTable("Library")]
    public class Library
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }

        [DynamoDBRangeKey]
        public string LibraryId { get; set; }

        public string Title { get; set; }

        public string Image { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        public int NumberOfUses { get; set; }

        public TemplateStructure Structure { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime ModifiedDate { get; set; }
    }
}
