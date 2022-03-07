using System;

namespace CafApi.ViewModel
{
    public class CandidateResponse
    {
        public string CandidateId { get; set; }

        public string CandidateName { get; set; }

        public string Position { get; set; }

        public string ResumeUrl { get; set; }

        public string ResumeFile { get; set; }

        public string LinkedIn { get; set; }

        public string GitHub { get; set; }

        public string CodingRepo { get; set; }

        public int TotalInterviews { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Status { get; set; }

        public bool Archived { get; set; }
    }
}