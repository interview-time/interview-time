using System;
using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;

namespace CafApi.Models
{
    [DynamoDBTable("Job")]
    public class Job
    {
        [DynamoDBHashKey]
        public string TeamId { get; set; }

        [DynamoDBRangeKey]
        public string JobId { get; set; }

        public string Title { get; set; }

        public string Location { get; set; }

        public string Department { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime? Deadline { get; set; }

        public List<string> Tags { get; set; }

        public string Description { get; set; }

        public string Owner { get; set; }

        [DynamoDBIgnore]
        public string OwnerName { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        public string Status { get; set; }

        public List<Stage> Pipeline { get; set; }
    }

    public class Stage
    {
        public string StageId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string Colour { get; set; }

        public string Type { get; set; }

        public string TemplateId { get; set; }

        public bool Disabled { get; set; }

        public List<StageCandidate> Candidates { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }
    }

    public class StageCandidate
    {
        public string CandidateId { get; set; }

        [DynamoDBIgnore]
        public string Name { get; set; }

        [DynamoDBIgnore]
        public string Position { get; set; }

        [DynamoDBIgnore]
        public string Status { get; set; }

        public DateTime MovedToStage { get; set; }

        public DateTime OriginallyAdded { get; set; }
    }
}
