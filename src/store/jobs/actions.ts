import { Job } from "../models";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios, { AxiosError } from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";
import { Dispatch } from "redux";
import { ApiRequestStatus, RootState } from "../state-models";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

export enum JobsApiRequest {
    CreateJob = "CreateJob",
    GetJobs = "GetJobs",
    GetJobDetails = "GetJobDetails",
}

export enum JobActionType {
    SET_JOBS = "SET_JOBS",
    SET_JOB_DETAILS = "SET_JOB_DETAILS",
    SET_REQUEST_SUCCESS = "SET_REQUEST_SUCCESS",
    SET_REQUEST_IN_PROGRESS = "SET_REQUEST_IN_PROGRESS",
    SET_REQUEST_FAILED = "SET_REQUEST_FAILED",
    SET_REQUEST_RESET = "SET_REQUEST_RESET",
}

export type SetJobsAction = {
    type: JobActionType.SET_JOBS;
    jobs: Job[];
};

export type SetJobDetailsAction = {
    type: JobActionType.SET_JOB_DETAILS;
    job: Job;
};

export type SetRequestSuccessAction = {
    type: JobActionType.SET_REQUEST_SUCCESS;
    requestType: JobsApiRequest;
};

export type SetRequestInProgressAction = {
    type: JobActionType.SET_REQUEST_IN_PROGRESS;
    requestType: JobsApiRequest;
};

export type SetRequestFailedAction = {
    type: JobActionType.SET_REQUEST_FAILED;
    requestType: JobsApiRequest;
    error?: string;
};

export type SetRequestResetAction = {
    type: JobActionType.SET_REQUEST_RESET;
    requestType: JobsApiRequest;
};

export type JobActions =
    | SetJobsAction
    | SetJobDetailsAction
    | SetRequestSuccessAction
    | SetRequestInProgressAction
    | SetRequestFailedAction
    | SetRequestResetAction;

export const setJobs = (jobs: Job[]): SetJobsAction => ({
    type: JobActionType.SET_JOBS,
    jobs: jobs,
});

export const setJobDetails = (job: Job): SetJobDetailsAction => ({
    type: JobActionType.SET_JOB_DETAILS,
    job: job,
});

export const setRequestSuccess = (requestType: JobsApiRequest): SetRequestSuccessAction => ({
    type: JobActionType.SET_REQUEST_SUCCESS,
    requestType: requestType,
});

export const setRequestInProgress = (requestType: JobsApiRequest): SetRequestInProgressAction => ({
    type: JobActionType.SET_REQUEST_IN_PROGRESS,
    requestType: requestType,
});

export const setRequestFailed = (requestType: JobsApiRequest, error?: string): SetRequestFailedAction => ({
    type: JobActionType.SET_REQUEST_FAILED,
    requestType: requestType,
    error: error,
});

export const setRequestReset = (requestType: JobsApiRequest): SetRequestResetAction => ({
    type: JobActionType.SET_REQUEST_RESET,
    requestType: requestType,
});

export const fetchJobs =
    (forceFetch = false) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
        const { user, jobs } = getState();

        if (forceFetch || (jobs.jobs.length === 0 && jobs.apiResults.GetJobs.status !== ApiRequestStatus.InProgress)) {
            const token = await getAccessTokenSilently();
            const teamId = user.profile.currentTeamId;

            dispatch(setRequestInProgress(JobsApiRequest.GetJobs));

            try {
                const result = await axios.get(`${BASE_URI}/team/${teamId}/jobs`, config(token));

                dispatch(setJobs(result.data?.jobs ?? []));

                dispatch(setRequestSuccess(JobsApiRequest.GetJobs));
                dispatch(setRequestReset(JobsApiRequest.GetJobs));
            } catch (error) {
                logError(error);

                const axiosErr = error as AxiosError;
                dispatch(setRequestFailed(JobsApiRequest.GetJobs, axiosErr?.message));
            }
        }
    };

export const fetchJobDetails = (candidateId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    dispatch(setRequestInProgress(JobsApiRequest.GetJobDetails));

    try {
        const result = await axios.get(`${BASE_URI}/team/${teamId}/job/${candidateId}`, config(token));

        dispatch(setJobDetails(result.data));
        dispatch(setRequestSuccess(JobsApiRequest.GetJobDetails));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(JobsApiRequest.GetJobDetails, axiosErr?.message));
    }
};

export const createJob = (job: Job) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    dispatch(setRequestInProgress(JobsApiRequest.CreateJob));

    try {
        const newCandidate = await axios.post(`${BASE_URI}/team/${teamId}/job`, job, config(token));

        dispatch(setJobDetails(newCandidate.data));
        dispatch(setRequestSuccess(JobsApiRequest.CreateJob));
        dispatch(setRequestReset(JobsApiRequest.CreateJob));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(JobsApiRequest.CreateJob, axiosErr?.message));
    }
};
