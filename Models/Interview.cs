using System;
using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Utils;

namespace CafApi.Models
{
    [DynamoDBTable("Interview")]
    public class Interview
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }

        [DynamoDBRangeKey]
        public string InterviewId { get; set; }

        public string CandidateId { get; set; }

        public string Candidate { get; set; }

        public string CandidateNotes { get; set; }

        public string Position { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime InterviewDateTime { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime InterviewEndDateTime { get; set; }

        [DynamoDBGlobalSecondaryIndexHashKey]
        public string TemplateId { get; set; }

        public List<string> TemplateIds { get; set; }

        public string LibraryId { get; set; }

        public string Status { get; set; }

        public int Decision { get; set; }

        public string Notes { get; set; }

        public List<RedFlag> RedFlags { get; set; }

        public InterviewStructure Structure { get; set; }

        public bool IsDemo { get; set; }

        public string TeamId { get; set; }

        [DynamoDBIgnore]
        public string CreatedBy { get; set; }

        public List<string> Interviewers { get; set; }

        public string LinkId { get; set; }

        public string Token { get; set; }

        public bool IsShared { get; set; }

        public string InterviewType { get; set; }

        public List<string> ChallengeIds { get; set; }

        [DynamoDBIgnore]
        public List<Challenge> Challenges { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
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

    public class RedFlag
    {
        public string Label { get; set; }

        public int Order { get; set; }
    }
}