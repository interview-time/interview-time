import { JobsState } from "../state-models";
import { uniq } from "lodash";

export const selectDepartments = (state: JobsState) => uniq(state.jobs.map(job => job.department));

export const selectJobDetails = (state: JobsState, jobId: string | undefined) =>
    state.jobsDetail.find(job => job.jobId === jobId);
