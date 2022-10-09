import axios from "axios";
import { logError } from "../../utils/log";
import { ChallengeStatus } from "../models";
import { ChallengeDetails } from "../models";
import { Dispatch } from "redux";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";
import { RootState } from "../state-models";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

export enum ChallengeActionType {
    SET_CHALLENGE = "SET_CHALLENGE",
    SET_CHALLENGE_LOADING = "SET_CHALLENGE_LOADING",
    SET_CHALLENGE_ERROR = "SET_CHALLENGE_ERROR",
    SET_CHALLENGE_STATUS = "SET_CHALLENGE_STATUS",
    SET_CHALLENGE_EXPIRED = "SET_CHALLENGE_EXPIRED",
    RESET_CHALLENGE = "RESET_CHALLENGE",
    SEND_CHALLENGE = "SEND_CHALLENGE",
}

export type ResetChallengeAction = {
    type: ChallengeActionType.RESET_CHALLENGE;
};

export type SetChallengeAction = {
    type: ChallengeActionType.SET_CHALLENGE;
    challenge: ChallengeDetails;
};

export type SetIsExpiredAction = {
    type: ChallengeActionType.SET_CHALLENGE_EXPIRED;
    isExpired: boolean;
};

export type SetLoadingAction = {
    type: ChallengeActionType.SET_CHALLENGE_LOADING;
    loading: boolean;
};

export type SetErrorAction = {
    type: ChallengeActionType.SET_CHALLENGE_ERROR;
    isError: boolean;
};

export type SetStatusAction = {
    type: ChallengeActionType.SET_CHALLENGE_STATUS;
    status: ChallengeStatus;
};

export type SendChallengeAction = {
    type: ChallengeActionType.SEND_CHALLENGE;
    sendViaLink: boolean;
};

export type ChallengeActions =
    | ResetChallengeAction
    | SetChallengeAction
    | SetIsExpiredAction
    | SetLoadingAction
    | SetErrorAction
    | SetStatusAction
    | SendChallengeAction;

export const resetChallenge = (): ResetChallengeAction => ({
    type: ChallengeActionType.RESET_CHALLENGE,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
    type: ChallengeActionType.SET_CHALLENGE_LOADING,
    loading: loading,
});

export const setError = (isError: boolean): SetErrorAction => ({
    type: ChallengeActionType.SET_CHALLENGE_ERROR,
    isError: isError,
});

export const setIsExpired = (isExpired: boolean): SetIsExpiredAction => ({
    type: ChallengeActionType.SET_CHALLENGE_EXPIRED,
    isExpired: isExpired,
});

export const setChallenge = (challenge: ChallengeDetails): SetChallengeAction => ({
    type: ChallengeActionType.SET_CHALLENGE,
    challenge: challenge,
});

export const setStatus = (status: ChallengeStatus): SetStatusAction => ({
    type: ChallengeActionType.SET_CHALLENGE_STATUS,
    status: status,
});

export type SendChallengeProps = {
    interviewId: string;
    challengeId: string;
    sendViaLink: boolean;
    onSuccess?: () => void;
    onError?: () => void;
};

export const sendChallenge =
    ({ interviewId, challengeId, sendViaLink, onSuccess, onError }: SendChallengeProps) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
        const token = await getAccessTokenSilently();
        const { user } = getState();
        try {
            await axios.post(
                `${BASE_URI}/team/${user.profile.currentTeamId}/challenge/${challengeId}/send`,
                {
                    interviewId: interviewId,
                    sendViaLink: sendViaLink,
                },
                config(token)
            );
            onSuccess?.();
        } catch (error) {
            logError(error);
            onError?.();
        }
    };

export const loadChallenge = (token: string) => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(false));
    dispatch(setIsExpired(false));

    try {
        const result = await axios.get(`${BASE_URI}/challenge/${token}`);

        dispatch(setChallenge(result.data));
    } catch (error) {
        // @ts-ignore
        if (error.response.status === 404) {
            dispatch(setIsExpired(true));
        } else {
            dispatch(setError(true));
            logError(error);
        }
    } finally {
        dispatch(setLoading(false));
    }
};

export const submitSolution = (token: string, gitHubUrl: string) => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(false));
    try {
        const request = {
            GitHubUrls: [gitHubUrl],
        };

        await axios.post(`${BASE_URI}/challenge/${token}`, request);

        dispatch(setStatus(ChallengeStatus.SolutionSubmitted));
    } catch (error) {
        dispatch(setError(true));
        logError(error);
    } finally {
        dispatch(setLoading(false));
    }
};
