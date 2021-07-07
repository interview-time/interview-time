using System;
using Amazon.DynamoDBv2.DataModel;

namespace CafApi.Models
{
    [DynamoDBTable("Template")]
    public class Template
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }

        [DynamoDBRangeKey]
        public string TemplateId { get; set; }

        public string Title { get; set; }

        public string Image { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        [DynamoDBIgnore]
        public int TotalInterviews { get; set; }

        public TemplateStructure Structure { get; set; }

        public bool IsDemo { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }
    }
}