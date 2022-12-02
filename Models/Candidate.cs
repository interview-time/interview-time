using System;
using System.Collections.Generic;
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

        public string MergeId { get; set; } // candidate ID in Merge.dev (exists when candidate imported from ATS)

        public string RemoteId { get; set; } // candidate ID in the ATS 

        public string CandidateName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Position { get; set; }

        public string ResumeFile { get; set; }

        public string LinkedIn { get; set; }

        public string GitHub { get; set; }        

        public string Status { get; set; }

        public bool Archived { get; set; }

        public string Owner { get; set; }

        public string Location { get; set; }

        public List<string> Tags { get; set; }

        public bool IsDemo { get; set; }

        public string ModifiedBy { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime CreatedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime? ModifiedDate { get; set; }

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime? RemoteCreatedDate { get; set; } // CreatedDate in ATS

        [DynamoDBProperty(typeof(DateTimeUtcConverter))]
        public DateTime? RemoteModifiedDate { get; set; } // ModifiedDate in ATS
    }
}