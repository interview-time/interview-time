import { RootState } from "../state-models";
import { uniq } from "lodash";
import { CandidateStageStatus } from "../models";

export const selectJobs = (state: RootState) => state.jobs.jobs;

export const selectDepartments = (state: RootState) => uniq(state.jobs.jobs.map(job => job.department));

export const selectJobDetails = (jobId: string | undefined) => (state: RootState) =>
    state.jobs.jobsDetail.find(job => job.jobId === jobId);

export const selectGetJobDetailsStatus = (state: RootState) => state.jobs.apiResults.GetJobDetails.status;

export const selectGetJobsStatus = (state: RootState) => state.jobs.apiResults.GetJobs.status;

export const selectCreateJobStatus = (state: RootState) => state.jobs.apiResults.CreateJob.status;

export const selectUpdateJobStatus = (state: RootState) => state.jobs.apiResults.UpdateJob.status;

export const selectAddCandidateToJobStatus = (state: RootState) => state.jobs.apiResults.AddCandidateToJob.status;

export const getCandidateStageStatusText = (status: CandidateStageStatus) => {
    if (status === CandidateStageStatus.AWAITING_FEEDBACK) {
        return "Awaiting Feedback";
    } else if (status === CandidateStageStatus.FEEDBACK_AVAILABLE) {
        return "Feedback Available";
    } else if (status === CandidateStageStatus.INTERVIEW_SCHEDULED) {
        return "Interview Scheduled";
    } else if (status === CandidateStageStatus.SCHEDULE_INTERVIEW) {
        return "Schedule Interview";
    }
};
