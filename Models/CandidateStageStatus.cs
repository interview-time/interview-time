using System.Collections.Generic;
using System.Linq;

namespace CafApi.Models
{
    public enum CandidateStageStatus
    {
        SHCHEDULE_INTERVIEW,
        INTERVIEW_SCHEDULED,
        AWAITING_FEEDBACK,
        FEEDBACK_AVAILABLE
    }

    public static class CandidateStageHelper
    {
        public static string GetCandidateStatus(List<Interview> jobInterviews, string candidateId, string stageId)
        {
            var stageInterviews = jobInterviews
                .Where(i => i.CandidateId == candidateId && i.StageId == stageId)
                .ToList();

            if (stageInterviews.Count() > 0 && stageInterviews.All(i => i.Status == InterviewStatus.SUBMITTED.ToString()))
            {
                return CandidateStageStatus.FEEDBACK_AVAILABLE.ToString();
            }
            else if (stageInterviews.Count() > 0 && stageInterviews.Any(i => i.Status == InterviewStatus.SUBMITTED.ToString()))
            {
                return CandidateStageStatus.AWAITING_FEEDBACK.ToString();
            }
            else if (stageInterviews.Count() > 0 && stageInterviews.All(i => i.Status == InterviewStatus.NEW.ToString()))
            {
                return CandidateStageStatus.INTERVIEW_SCHEDULED.ToString();
            }
            else if (stageInterviews == null || stageInterviews.Count() == 0)
            {
                return CandidateStageStatus.SHCHEDULE_INTERVIEW.ToString();
            }

            return null;
        }
    }
}
