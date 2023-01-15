import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios, { AxiosError } from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";
import {
    Interview, InterviewChecklist,
    InterviewStatus,
    InterviewType,
    LiveCodingChallenge,
    TakeHomeChallenge, TemplateStructure
} from "../models";
import { Dispatch } from "redux";
import { ApiRequestStatus, RootState } from "../state-models";
import { formatDateISO } from "../../utils/date-fns";

const BASE_URL = `${process.env.REACT_APP_API_URL}`;

export enum InterviewApiRequest {
    GetInterviews = "GetInterviews",
    AddInterview = "AddInterview",
    UpdateInterview = "UpdateInterview",
    DeleteInterview = "DeleteInterview",
    ShareScorecard = "ShareScorecard",
    UnshareScorecard = "UnshareScorecard",
    GetSharedScorecard = "GetSharedScorecard",
}

export enum InterviewActionType {
    SET_INTERVIEWS = "SET_INTERVIEWS",
    SET_NEW_INTERVIEW = "SET_NEW_INTERVIEW",
    SET_UPDATED_INTERVIEW = "SET_UPDATED_INTERVIEW",
    SET_REMOVED_INTERVIEW = "SET_REMOVED_INTERVIEW",
    SET_SHARED_INTERVIEW = "SET_SHARED_INTERVIEW",
    SET_UNSHARED_INTERVIEW = "SET_UNSHARED_INTERVIEW",
    SET_CACHE_SHARED_INTERVIEW = "SET_CACHE_SHARED_INTERVIEW",
    SET_REQUEST_SUCCESS = "SET_REQUEST_SUCCESS",
    SET_REQUEST_IN_PROGRESS = "SET_REQUEST_IN_PROGRESS",
    SET_REQUEST_FAILED = "SET_REQUEST_FAILED",
    SET_REQUEST_RESET = "SET_REQUEST_RESET",
}

// MARK: Store actions

export type SetInterviewsAction = {
    type: InterviewActionType.SET_INTERVIEWS;
    interviews: Interview[];
};

export type SetNewInterviewAction = {
    type: InterviewActionType.SET_NEW_INTERVIEW;
    interview: Interview;
};

export type SetUpdatedInterviewAction = {
    type: InterviewActionType.SET_UPDATED_INTERVIEW;
    interview: Interview;
};

export type SetRemovedInterviewAction = {
    type: InterviewActionType.SET_REMOVED_INTERVIEW;
    interviewId: string;
};

export type SetSharedInterviewAction = {
    type: InterviewActionType.SET_SHARED_INTERVIEW;
    interviewId: string;
    shareToken: string;
};

export type SetUnsharedInterviewAction = {
    type: InterviewActionType.SET_UNSHARED_INTERVIEW;
    interviewId: string;
};

export type SetCacheSharedInterviewAction = {
    type: InterviewActionType.SET_CACHE_SHARED_INTERVIEW;
    interview: Interview;
    shareToken: string;
};

export type SetRequestSuccessAction = {
    type: InterviewActionType.SET_REQUEST_SUCCESS;
    requestType: InterviewApiRequest;
};

export type SetRequestInProgressAction = {
    type: InterviewActionType.SET_REQUEST_IN_PROGRESS;
    requestType: InterviewApiRequest;
};

export type SetRequestFailedAction = {
    type: InterviewActionType.SET_REQUEST_FAILED;
    requestType: InterviewApiRequest;
    error?: string;
};

export type SetRequestResetAction = {
    type: InterviewActionType.SET_REQUEST_RESET;
    requestType: InterviewApiRequest;
};

export type InterviewActions =
    | SetInterviewsAction
    | SetNewInterviewAction
    | SetUpdatedInterviewAction
    | SetRemovedInterviewAction
    | SetSharedInterviewAction
    | SetUnsharedInterviewAction
    | SetCacheSharedInterviewAction
    | SetRequestSuccessAction
    | SetRequestInProgressAction
    | SetRequestFailedAction
    | SetRequestResetAction;

export const setInterviews = (interviews: Interview[]): SetInterviewsAction => ({
    type: InterviewActionType.SET_INTERVIEWS,
    interviews: interviews,
});

export const setNewInterview = (interview: Interview): SetNewInterviewAction => ({
    type: InterviewActionType.SET_NEW_INTERVIEW,
    interview: interview,
});

export const setUpdatedInterview = (interview: Interview): SetUpdatedInterviewAction => ({
    type: InterviewActionType.SET_UPDATED_INTERVIEW,
    interview: interview,
});

export const setRemovedInterview = (interviewId: string): SetRemovedInterviewAction => ({
    type: InterviewActionType.SET_REMOVED_INTERVIEW,
    interviewId: interviewId,
});

export const setSharedInterview = (interviewId: string, shareToken: string): SetSharedInterviewAction => ({
    type: InterviewActionType.SET_SHARED_INTERVIEW,
    interviewId: interviewId,
    shareToken: shareToken,
});

export const setUnsharedInterview = (interviewId: string): SetUnsharedInterviewAction => ({
    type: InterviewActionType.SET_UNSHARED_INTERVIEW,
    interviewId: interviewId,
});

export const setCacheSharedInterview = (shareToken: string, interview: Interview): SetCacheSharedInterviewAction => ({
    type: InterviewActionType.SET_CACHE_SHARED_INTERVIEW,
    shareToken: shareToken,
    interview: interview,
});

export const setRequestSuccess = (requestType: InterviewApiRequest): SetRequestSuccessAction => ({
    type: InterviewActionType.SET_REQUEST_SUCCESS,
    requestType: requestType,
});

export const setRequestInProgress = (requestType: InterviewApiRequest): SetRequestInProgressAction => ({
    type: InterviewActionType.SET_REQUEST_IN_PROGRESS,
    requestType: requestType,
});

export const setRequestFailed = (requestType: InterviewApiRequest, error?: string): SetRequestFailedAction => ({
    type: InterviewActionType.SET_REQUEST_FAILED,
    requestType: requestType,
    error: error,
});

export const setRequestReset = (requestType: InterviewApiRequest): SetRequestResetAction => ({
    type: InterviewActionType.SET_REQUEST_RESET,
    requestType: requestType,
});

// MARK: API actions

export const loadInterviews =
    (forceFetch = false) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
        const { user, interviews } = getState();

        if (
            forceFetch ||
            (interviews.interviews.length === 0 &&
                interviews.apiResults.GetInterviews.status !== ApiRequestStatus.InProgress)
        ) {
            const token = await getAccessTokenSilently();
            const teamId = user.profile.currentTeamId;

            dispatch(setRequestInProgress(InterviewApiRequest.GetInterviews));

            try {
                const result = await axios.get(`${BASE_URL}/interview/${teamId}`, config(token));

                dispatch(setInterviews(result.data ?? []));

                dispatch(setRequestSuccess(InterviewApiRequest.GetInterviews));
                dispatch(setRequestReset(InterviewApiRequest.GetInterviews));
            } catch (error) {
                logError(error);

                const axiosErr = error as AxiosError;
                dispatch(setRequestFailed(InterviewApiRequest.GetInterviews, axiosErr?.message));
            }
        }
    };

export interface NewInterview {
    interviewers: string[];
    interviewDateTime: string;
    interviewEndDateTime: string;
    teamId: string;
    candidateId: string;
    candidate: string;
    sendChallenge: boolean;
    status: InterviewStatus;
    templateIds: string[];
    interviewType: InterviewType;
    liveCodingChallenges?: LiveCodingChallenge[];
    takeHomeChallenge?: TakeHomeChallenge;
    structure: TemplateStructure;
    checklist?: InterviewChecklist[];
}

export const addInterview = (interview: NewInterview) => async (dispatch: Dispatch) => {
    const token = await getAccessTokenSilently();

    dispatch(setRequestInProgress(InterviewApiRequest.AddInterview));

    try {
        const result = await axios.post(`${BASE_URL}/interview/`, interview, config(token));

        dispatch(setNewInterview(result.data));

        dispatch(setRequestSuccess(InterviewApiRequest.AddInterview));
        dispatch(setRequestReset(InterviewApiRequest.AddInterview));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(InterviewApiRequest.AddInterview, axiosErr?.message));
    }
};

export const updateInterview = (interview: Interview) => async (dispatch: Dispatch) => {
    interview.modifiedDate = formatDateISO(new Date());

    const token = await getAccessTokenSilently();
    dispatch(setRequestInProgress(InterviewApiRequest.UpdateInterview));

    try {
        const result = await axios.put(`${BASE_URL}/interview/`, interview, config(token));
        if (result.data) {
            dispatch(setUpdatedInterview(result.data));
        } else {
            dispatch(setUpdatedInterview(interview));
        }

        dispatch(setRequestSuccess(InterviewApiRequest.UpdateInterview));
        dispatch(setRequestReset(InterviewApiRequest.UpdateInterview));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(InterviewApiRequest.UpdateInterview, axiosErr?.message));
    }
};

export const deleteInterview = (interviewId: string) => async (dispatch: Dispatch) => {
    const token = await getAccessTokenSilently();

    dispatch(setRequestInProgress(InterviewApiRequest.DeleteInterview));

    try {
        await axios.delete(`${BASE_URL}/interview/${interviewId}`, config(token));
        dispatch(setRemovedInterview(interviewId));

        dispatch(setRequestSuccess(InterviewApiRequest.DeleteInterview));
        dispatch(setRequestReset(InterviewApiRequest.DeleteInterview));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(InterviewApiRequest.DeleteInterview, axiosErr?.message));
    }
};

export const shareScorecard = (interviewId: string) => async (dispatch: Dispatch) => {
    const token = await getAccessTokenSilently();
    dispatch(setRequestInProgress(InterviewApiRequest.ShareScorecard));

    try {
        const data = {
            interviewId: interviewId,
        };
        const result = await axios.patch(`${BASE_URL}/scorecard/share`, data, config(token));
        let shareToken = result?.data?.token;
        if (shareToken) {
            dispatch(setSharedInterview(interviewId, shareToken));
        }

        dispatch(setRequestSuccess(InterviewApiRequest.ShareScorecard));
        dispatch(setRequestReset(InterviewApiRequest.ShareScorecard));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(InterviewApiRequest.ShareScorecard, axiosErr?.message));
    }
};

export const unshareScorecard = (interviewId: string) => async (dispatch: Dispatch) => {
    const token = await getAccessTokenSilently();
    dispatch(setRequestInProgress(InterviewApiRequest.UnshareScorecard));

    try {
        const data = {
            interviewId: interviewId,
        };
        await axios.patch(`${BASE_URL}/scorecard/unshare`, data, config(token));
        dispatch(setUnsharedInterview(interviewId));

        dispatch(setRequestSuccess(InterviewApiRequest.UnshareScorecard));
        dispatch(setRequestReset(InterviewApiRequest.UnshareScorecard));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(InterviewApiRequest.UnshareScorecard, axiosErr?.message));
    }
};

export const getSharedScorecard = (token: string) => async (dispatch: Dispatch) => {
    dispatch(setRequestInProgress(InterviewApiRequest.GetSharedScorecard));

    try {
        const scorecard = await axios.get(`${BASE_URL}/public/scorecard/${token}`);
        if (scorecard.data) {
            dispatch(setCacheSharedInterview(token, scorecard.data));
        }

        dispatch(setRequestSuccess(InterviewApiRequest.GetSharedScorecard));
        dispatch(setRequestReset(InterviewApiRequest.GetSharedScorecard));
    } catch (error) {
        logError(error);

        const axiosErr = error as AxiosError;
        dispatch(setRequestFailed(InterviewApiRequest.GetSharedScorecard, axiosErr?.message));
    }
};
