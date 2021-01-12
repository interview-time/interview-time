using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;

namespace CafApi.Models
{
    [DynamoDBTable("Guide")]
    public class Guide
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }

        [DynamoDBRangeKey]
        public string GuideId { get; set; }

        public string Title { get; set; }

        public string Image { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        [DynamoDBIgnore]
        public int TotalInterviews { get; set; }

        public GuideStructure Structure { get; set; }
    }

    public class GuideStructure
    {
        public string Header { get; set; }

        public string Footer { get; set; }

        public List<GuideGroup> Groups { get; set; }
    }

    public class GuideGroup
    {
        public string GroupId { get; set; }
        
        public string Name { get; set; }

        public List<GuideQuestion> Questions { get; set; }
    }
    
    public class GuideQuestion
    {
        public string QuestionId { get; set; }
        
        public string Question { get; set; }

        public List<string> Tags { get; set; }

        public int Time { get; set; }
    }
}