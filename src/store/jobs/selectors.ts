import { RootState } from "../state-models";
import { uniq } from "lodash";

export const selectJobs = (state: RootState) => state.jobs.jobs;

export const selectDepartments = (state: RootState) => uniq(state.jobs.jobs.map(job => job.department));

export const selectJobDetails = (state: RootState, jobId: string | undefined) =>
    state.jobs.jobsDetail.find(job => job.jobId === jobId);

export const selectGetJobsStatus = (state: RootState) => state.jobs.apiResults.GetJobs.status

export const selectCreateJobStatus = (state: RootState) => state.jobs.apiResults.CreateJob.status
