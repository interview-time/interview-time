using System;
using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;

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

        public string InterviewType { get; set; }

        [DynamoDBIgnore]
        public int TotalInterviews { get; set; }

        [DynamoDBIgnore]
        public string Owner { get; set; }

        public TemplateStructure Structure { get; set; }

        public bool IsDemo { get; set; }

        public bool IsShared { get; set; }

        public string Token { get; set; }

        public string TeamId { get; set; }

        public List<string> ChallengeIds { get; set; }

        public List<ChecklistItem> Checklist { get; set; }

        [DynamoDBIgnore]
        public List<Challenge> Challenges { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime ModifiedDate { get; set; }
    }

    public class ChecklistItem
    {
        public int Order { get; set; }

        public string Item { get; set; }
    }
}