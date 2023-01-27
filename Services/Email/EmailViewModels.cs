using System;

namespace CafApi.Services.Email
{
    public class InterviewCancelledToInterviewerModel
    {
        public string InterviewerEmail { get; set; }

        public string InterviewerName { get; set; }

        public string CandidateName { get; set; }        

        public DateTime InterviewStartTime { get; set; }

        public string Timezone { get; set; }
    }
}
