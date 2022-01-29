using System;
using Amazon.DynamoDBv2.DataModel;

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

        public string Position { get; set; }

        public string ResumeFile { get; set; }

        public string LinkedIn { get; set; }

        public string GitHub { get; set; }

        public string CodingRepo { get; set; }

        public string Status { get; set; }

        public string CreatedByUserId { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }
    }
}