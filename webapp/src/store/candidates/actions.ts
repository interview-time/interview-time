import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios, { AxiosError } from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";
import { Dispatch } from "redux";
import { RootState } from "../state-models";
import { Candidate } from "../models";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

export enum ApiRequest {
    GetCandidateList = "GetCandidateList",
    GetCandidateDetails = "GetCandidateDetails",
    CreateCandidate = "CreateCandidate",
    UpdateCandidate = "UpdateCandidate",
    DeleteCandidate = "DeleteCandidate",
    ArchiveCandidate = "ArchiveCandidate",
}

export enum CandidateActionType {
    SET_LOADING = "SET_CANDIDATE_LOADING",
    SET_ERROR = "SET_CANDIDATE_ERROR",
    SET_CANDIDATE_LIST = "SET_CANDIDATE_LIST",
    SET_CANDIDATE_DETAILS = "SET_CANDIDATE_DETAILS",
    SET_CANDIDATE = "SET_CANDIDATE",
    SET_UPLOAD_URL = "SET_UPLOAD_URL",
    REMOVE_CANDIDATE = "REMOVE_CANDIDATE",
    SET_ARCHIVE_CANDIDATE = "SET_ARCHIVE_CANDIDATE",
    SET_REQUEST_SUCCESS = "SET_REQUEST_SUCCESS",
    SET_REQUEST_IN_PROGRESS = "SET_REQUEST_IN_PROGRESS",
    SET_REQUEST_FAILED = "SET_REQUEST_FAILED",
    SET_REQUEST_RESET = "SET_REQUEST_RESET",
}

export type SetLoadingAction = {
    type: CandidateActionType.SET_LOADING;
    loading: boolean;
};

export type SetErrorAction = {
    type: CandidateActionType.SET_ERROR;
    isError: boolean;
};

export type SetCandidateDetailsAction = {
    type: CandidateActionType.SET_CANDIDATE_DETAILS;
    candidateDetails: Candidate;
};

export type SetCandidateAction = {
    type: CandidateActionType.SET_CANDIDATE;
    candidate: Candidate;
};

export type SetCandidateListAction = {
    type: CandidateActionType.SET_CANDIDATE_LIST;
    candidates: Candidate[];
};

export type SetUploadUrlAction = {
    type: CandidateActionType.SET_UPLOAD_URL;
    uploadUrl: string;
};

export type RemoveCandidateAction = {
    type: CandidateActionType.REMOVE_CANDIDATE;
    candidateId: string;
};

export type SetArchiveCandidateAction = {
    type: CandidateActionType.SET_ARCHIVE_CANDIDATE;
    candidateId: string;
    archived: boolean;
};

export type SetRequestSuccessAction = {
    type: CandidateActionType.SET_REQUEST_SUCCESS;
    requestType: ApiRequest;
};

export type SetRequestInProgressAction = {
    type: CandidateActionType.SET_REQUEST_IN_PROGRESS;
    requestType: ApiRequest;
};

export type SetRequestFailedAction = {
    type: CandidateActionType.SET_REQUEST_FAILED;
    requestType: ApiRequest;
    error?: string;
};

export type SetRequestResetAction = {
    type: CandidateActionType.SET_REQUEST_RESET;
    requestType: ApiRequest;
};

export type CandidateActions =
    | SetLoadingAction
    | SetErrorAction
    | SetCandidateAction
    | SetCandidateDetailsAction
    | SetCandidateListAction
    | SetUploadUrlAction
    | RemoveCandidateAction
    | SetArchiveCandidateAction
    | SetRequestSuccessAction
    | SetRequestInProgressAction
    | SetRequestFailedAction
    | SetRequestResetAction;

export const setLoading = (loading: boolean): SetLoadingAction => ({
    type: CandidateActionType.SET_LOADING,
    loading: loading,
});

export const setError = (isError: boolean): SetErrorAction => ({
    type: CandidateActionType.SET_ERROR,
    isError: isError,
});

export const setCandidateDetails = (candidateDetails: Candidate): SetCandidateDetailsAction => ({
    type: CandidateActionType.SET_CANDIDATE_DETAILS,
    candidateDetails: candidateDetails,
});

export const setCandidate = (candidate: Candidate): SetCandidateAction => ({
    type: CandidateActionType.SET_CANDIDATE,
    candidate: candidate,
});

export const setCandidateList = (candidates: Candidate[]): SetCandidateListAction => ({
    type: CandidateActionType.SET_CANDIDATE_LIST,
    candidates: candidates,
});

export const setUploadUrl = (uploadUrl: string): SetUploadUrlAction => ({
    type: CandidateActionType.SET_UPLOAD_URL,
    uploadUrl: uploadUrl,
});

export const removeCandidate = (candidateId: string): RemoveCandidateAction => ({
    type: CandidateActionType.REMOVE_CANDIDATE,
    candidateId: candidateId,
});

export const setArchiveCandidate = (candidateId: string, archived: boolean): SetArchiveCandidateAction => ({
    type: CandidateActionType.SET_ARCHIVE_CANDIDATE,
    candidateId: candidateId,
    archived: archived,
});

export const setRequestSuccess = (requestType: ApiRequest): SetRequestSuccessAction => ({
    type: CandidateActionType.SET_REQUEST_SUCCESS,
    requestType: requestType,
});

export const setRequestInProgress = (requestType: ApiRequest): SetRequestInProgressAction => ({
    type: CandidateActionType.SET_REQUEST_IN_PROGRESS,
    requestType: requestType,
});

export const setRequestFailed = (requestType: ApiRequest, error?: string): SetRequestFailedAction => ({
    type: CandidateActionType.SET_REQUEST_FAILED,
    requestType: requestType,
    error: error,
});

export const setRequestReset = (requestType: ApiRequest): SetRequestResetAction => ({
    type: CandidateActionType.SET_REQUEST_RESET,
    requestType: requestType,
});

export const loadCandidates =
    (forceFetch = false) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
        const { user, candidates } = getState();

        if (forceFetch || (candidates.candidates.length === 0 && !candidates.loading)) {
            const token = await getAccessTokenSilently();
            const teamId = user.profile.currentTeamId;

            dispatch(setRequestInProgress(ApiRequest.GetCandidateList));

            try {
                const result = await axios.get(`${BASE_URI}/team/${teamId}/candidates`, config(token));

                dispatch(setCandidateList(result.data?.candidates ?? []));

                dispatch(setRequestSuccess(ApiRequest.GetCandidateList));
                dispatch(setRequestReset(ApiRequest.GetCandidateList));
            } catch (error) {
                logError(error);

                const axiosErr = error as AxiosError;
                dispatch(setRequestFailed(ApiRequest.GetCandidateList, axiosErr?.message));
            }
        }
    };

export const fetchCandidateDetails = (candidateId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    dispatch(setRequestInProgress(ApiRequest.GetCandidateDetails));

    try {
        const result = await axios.get(`${BASE_URI}/team/${teamId}/candidate/${candidateId}`, config(token));

        dispatch(setCandidateDetails(result.data));
        dispatch(setRequestSuccess(ApiRequest.GetCandidateDetails));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(ApiRequest.GetCandidateDetails, axiosErr?.message));
    }
};

export const getUploadUrl =
    (candidateId: string, filename: string) => async (dispatch: Dispatch, getState: () => RootState) => {
        const { user } = getState();

        const token = await getAccessTokenSilently();
        const teamId = user.profile.currentTeamId;

        dispatch(setLoading(true));
        dispatch(setError(false));

        try {
            const result = await axios.get(
                `${URL}/upload-signed-url/${teamId}/${candidateId}/${filename}`,
                config(token)
            );

            dispatch(setUploadUrl(result.data));
        } catch (error) {
            logError(error);
            dispatch(setError(true));
        } finally {
            dispatch(setLoading(false));
        }
    };

export const createCandidate = (candidate: Candidate) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    dispatch(setRequestInProgress(ApiRequest.CreateCandidate));

    try {
        const newCandidate = await axios.post(`${BASE_URI}/team/${teamId}/candidate`, candidate, config(token));

        dispatch(setCandidateDetails(newCandidate.data));
        dispatch(setRequestSuccess(ApiRequest.CreateCandidate));
        dispatch(setRequestReset(ApiRequest.CreateCandidate));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(ApiRequest.CreateCandidate, axiosErr?.message));
    }
};

export const updateCandidate = (candidate: Candidate) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    dispatch(setRequestInProgress(ApiRequest.UpdateCandidate));

    try {
        await axios.put(`${BASE_URI}/team/${teamId}/candidate/${candidate.candidateId}`, candidate, config(token));

        dispatch(setCandidateDetails(candidate));
        dispatch(setRequestSuccess(ApiRequest.UpdateCandidate));
        dispatch(setRequestReset(ApiRequest.UpdateCandidate));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(ApiRequest.UpdateCandidate, axiosErr?.message));
    }
};

export const deleteCandidate = (candidateId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    dispatch(setRequestInProgress(ApiRequest.DeleteCandidate));

    try {
        await axios.delete(`${BASE_URI}/team/${teamId}/candidate/${candidateId}`, config(token));

        dispatch(removeCandidate(candidateId));

        dispatch(setRequestSuccess(ApiRequest.DeleteCandidate));
        dispatch(setRequestReset(ApiRequest.DeleteCandidate));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(ApiRequest.DeleteCandidate, axiosErr?.message));
    }
};

export const archiveCandidate = (candidateId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    const teamId = user.profile.currentTeamId;

    dispatch(setRequestInProgress(ApiRequest.ArchiveCandidate));

    try {
        await axios.post(`${BASE_URI}/team/${teamId}/candidate/${candidateId}/archive`, null, config(token));

        dispatch(setArchiveCandidate(candidateId, true));

        dispatch(setRequestSuccess(ApiRequest.ArchiveCandidate));
        dispatch(setRequestReset(ApiRequest.ArchiveCandidate));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(ApiRequest.ArchiveCandidate, axiosErr?.message));
    }
};

export const restoreArchivedCandidate =
    (candidateId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
        const { user } = getState();

        const token = await getAccessTokenSilently();
        const teamId = user.profile.currentTeamId;

        dispatch(setRequestInProgress(ApiRequest.ArchiveCandidate));

        try {
            await axios.post(
                `${BASE_URI}/team/${teamId}/candidate/${candidateId}/restore-archive`,
                null,
                config(token)
            );

            dispatch(setArchiveCandidate(candidateId, false));

            dispatch(setRequestSuccess(ApiRequest.ArchiveCandidate));
            dispatch(setRequestReset(ApiRequest.ArchiveCandidate));
        } catch (error) {
            logError(error);

            const axiosErr = error as AxiosError;
            dispatch(setRequestFailed(ApiRequest.ArchiveCandidate, axiosErr?.message));
        }
    };
