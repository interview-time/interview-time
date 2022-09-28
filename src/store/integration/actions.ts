import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";
import { Dispatch } from "redux";
import { RootState } from "../state-models";
import { setIntegrationComplete } from "../team/actions";

export const SET_LINK_TOKEN = "SET_LINK_TOKEN";
export const SET_LINK_TOKEN_LOADING = "SET_LINK_TOKEN_LOADING";
export const SET_LINK_TOKEN_ERROR = "SET_LINK_TOKEN_ERROR";
export const RESET_INTEGRATION = "RESET_INTEGRATION";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

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

        dispatch(setIntegrationComplete());
    } catch (error) {
        logError(error);
        dispatch(setError(true));
    }
};

export const setLinkToken = (linkToken: string) => ({
    type: SET_LINK_TOKEN,
    payload: { linkToken },
});

export const setLoading = (loading: boolean) => ({
    type: SET_LINK_TOKEN_LOADING,
    payload: { loading },
});

export const setError = (error: boolean) => ({
    type: SET_LINK_TOKEN_ERROR,
    payload: { error },
});

export const resetIntegration = () => ({
    type: RESET_INTEGRATION,
});
