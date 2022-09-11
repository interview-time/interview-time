using System;
using System.Collections.Generic;
using CafApi.Models;

namespace CafApi.ViewModel
{
    public class SharedScorecardResponse
    {
        public string CandidateName { get; set; }

        public string CandidateNotes { get; set; }

        public string Position { get; set; }

        public string InterviewerName { get; set; }

        public DateTime InterviewDateTime { get; set; }

        public DateTime InterviewEndDateTime { get; set; }

        public string InterviewType { get; set; }

        public string Status { get; set; }

        public int Decision { get; set; }

        public string Notes { get; set; }

        public List<RedFlag> RedFlags { get; set; }

        public InterviewStructure Structure { get; set; }
    }
}