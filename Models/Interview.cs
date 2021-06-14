using System;
using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;

namespace CafApi.Models
{
    [DynamoDBTable("Interview")]
    public class Interview
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }

        [DynamoDBRangeKey]
        public string InterviewId { get; set; }

        public string Candidate { get; set; }

        public string CandidateNotes { get; set; }

        public string Position { get; set; }

        public DateTime InterviewDateTime { get; set; }

        [DynamoDBGlobalSecondaryIndexHashKey]
        public string TemplateId { get; set; }

        public string Status { get; set; }

        public string Decision { get; set; }

        public string Notes { get; set; }

        public InterviewStructure Structure { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }
    }

    public class InterviewStructure
    {
        public string Header { get; set; }

        public string Footer { get; set; }

        public List<InterviewGroup> Groups { get; set; }
    }

    public class InterviewGroup
    {
        public string GroupId { get; set; }

        public string Name { get; set; }

        public List<InterviewQuestion> Questions { get; set; }

        public string Notes { get; set; }

        public int Assessment { get; set; }
    }

    public class InterviewQuestion
    {
        public string QuestionId { get; set; }

        public string Question { get; set; }

        public string Difficulty { get; set; }

        public List<string> Tags { get; set; }

        public int Time { get; set; }

        public string Notes { get; set; }

        public int Assessment { get; set; }
    }
}