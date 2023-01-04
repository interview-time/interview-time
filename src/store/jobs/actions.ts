import { Job, JobDetails } from "../models";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios, { AxiosError, AxiosResponse } from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";
import { Dispatch } from "redux";
import { ApiRequestStatus, RootState } from "../state-models";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

export enum JobsApiRequest {
    CreateJob = "CreateJob",
    UpdateJob = "UpdateJob",
    CloseJob = "CloseJob",
    GetJobs = "GetJobs",
    GetJobDetails = "GetJobDetails",
    AddCandidateToJob = "AddCandidateToJob",
    MoveCandidateToStage = "MoveCandidateToStage",
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
    jobDetails: JobDetails;
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

export const setJobDetails = (jobDetails: JobDetails): SetJobDetailsAction => ({
    type: JobActionType.SET_JOB_DETAILS,
    jobDetails: jobDetails,
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

export const fetchJobDetails = (jobId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    const request = axios.get(`${BASE_URI}/team/${teamId}/job/${jobId}`, config(token));
    await genericJobDetailsRequest(dispatch, JobsApiRequest.GetJobDetails, request);
};

export const createJob = (job: Job) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    const request = axios.post(`${BASE_URI}/team/${teamId}/job`, job, config(token));
    await genericJobDetailsRequest(dispatch, JobsApiRequest.CreateJob, request);
};

export const updateJob = (job: JobDetails) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    const request = axios.put(`${BASE_URI}/team/${teamId}/job/${job.jobId}`, job, config(token));
    await genericJobDetailsRequest(dispatch, JobsApiRequest.UpdateJob, request);
};

export const closeJob = (jobId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    const request = axios.post(`${BASE_URI}/team/${teamId}/job/${jobId}/close`, null, config(token));
    await genericJobDetailsRequest(dispatch, JobsApiRequest.CloseJob, request);
};

export const addCandidateToJob =
    (jobId: string, stageId: string, candidateId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
        const { user } = getState();

        const token = await getAccessTokenSilently();
        const teamId = user.profile.currentTeamId;
        const data = {
            candidateId: candidateId,
            stageId: stageId,
        };

        const request = axios.post(`${BASE_URI}/team/${teamId}/job/${jobId}/add-candidate`, data, config(token));
        await genericJobDetailsRequest(dispatch, JobsApiRequest.AddCandidateToJob, request);
    };

export const moveCandidateToStage =
    (jobId: string, stageId: string, candidateId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
        const { user } = getState();

        const token = await getAccessTokenSilently();
        const teamId = user.profile.currentTeamId;
        const data = {
            candidateId: candidateId,
            newStageId: stageId,
        };

        const request = axios.post(`${BASE_URI}/team/${teamId}/job/${jobId}/move-candidate`, data, config(token));
        await genericJobDetailsRequest(dispatch, JobsApiRequest.MoveCandidateToStage, request);
    };

const genericJobDetailsRequest = async (
    dispatch: Dispatch,
    requestType: JobsApiRequest,
    joDetailsApiRequest: Promise<AxiosResponse<JobDetails>>
) => {
    dispatch(setRequestInProgress(requestType));

    try {
        const result = await joDetailsApiRequest;

        dispatch(setJobDetails(result.data));
        dispatch(setRequestSuccess(requestType));
        dispatch(setRequestReset(requestType));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(requestType, axiosErr?.message));
    }
};
