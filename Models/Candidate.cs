using System;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;

namespace CafApi.Models
{
    [DynamoDBTable("Candidate")]
    public class Candidate
    {
        [DynamoDBHashKey]
        public string TeamId { get; set; }

        [DynamoDBRangeKey]
        public string CandidateId { get; set; }

        public string CandidateName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Position { get; set; }

        public string ResumeFile { get; set; }

        public string LinkedIn { get; set; }

        public string GitHub { get; set; }

        public string CodingRepo { get; set; }

        public string Status { get; set; }

        public bool Archived { get; set; }

        public string Owner { get; set; }

        public string ModifiedBy { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime? ModifiedDate { get; set; }
    }
}