import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";
import { Dispatch } from "redux";
import { RootState } from "../state-models";
import { setIntegrationComplete } from "../team/actions";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

export enum IntegrationActionType {
    SET_LINK_TOKEN = "SET_LINK_TOKEN",
    SET_LINK_TOKEN_LOADING = "SET_LINK_TOKEN_LOADING",
    SET_LINK_TOKEN_ERROR = "SET_LINK_TOKEN_ERROR",
    RESET_INTEGRATION = "RESET_INTEGRATION",
}

export type SetLinkTokenAction = {
    type: IntegrationActionType.SET_LINK_TOKEN;
    linkToken?: string;
};

export type SetLoadingAction = {
    type: IntegrationActionType.SET_LINK_TOKEN_LOADING;
    loading: boolean;
};

export type SetErrorAction = {
    type: IntegrationActionType.SET_LINK_TOKEN_ERROR;
    error: boolean;
};

export type ResetIntegrationAction = {
    type: IntegrationActionType.RESET_INTEGRATION;
};

export type IntegrationActions = SetLinkTokenAction | SetLoadingAction | SetErrorAction | ResetIntegrationAction;

export const setError = (error: boolean): SetErrorAction => ({
    type: IntegrationActionType.SET_LINK_TOKEN_ERROR,
    error: error,
});

export const resetIntegration = (): ResetIntegrationAction => ({
    type: IntegrationActionType.RESET_INTEGRATION,
});

export const setLinkToken = (linkToken?: string): SetLinkTokenAction => ({
    type: IntegrationActionType.SET_LINK_TOKEN,
    linkToken: linkToken,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
    type: IntegrationActionType.SET_LINK_TOKEN_LOADING,
    loading: loading,
});

export const getLinkToken = () => async (dispatch: Dispatch, getState: () => RootState) => {
    const token = await getAccessTokenSilently();
    const { user } = getState();

    try {
        dispatch(setError(false));
        dispatch(setLoading(true));

        var result = await axios.post(
            `${BASE_URI}/team/${user.profile.currentTeamId}/integration/link-token`,
            null,
            config(token)
        );

        dispatch(setLinkToken(result.data.linkToken));
    } catch (error) {
        logError(error);
        dispatch(setError(true));
    } finally {
        dispatch(setLoading(false));
    }
};

export const swapPublicToken = (publicToken: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const token = await getAccessTokenSilently();
    const { user } = getState();

    try {
        dispatch(setError(false));

        const request = {
            publicToken: publicToken,
        };

        await axios.post(
            `${BASE_URI}/team/${user.profile.currentTeamId}/integration/swap-public-token`,
            request,
            config(token)
        );

        dispatch(setLinkToken(undefined));
        dispatch(setIntegrationComplete());
    } catch (error) {
        logError(error);
        dispatch(setError(true));
    }
};
