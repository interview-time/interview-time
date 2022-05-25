import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import { logError } from "../../components/utils/log";

export const SET_PENDING_INVITES_LOADING = "SET_PENDING_INVITES_LOADING";
export const SET_PENDING_INVITES = "SET_PENDING_INVITES";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

export const setPendingInvitesLoading = loading => ({
    type: SET_PENDING_INVITES_LOADING,
    payload: { loading },
});

export const setPendingInvites = pendingInvites => ({
    type: SET_PENDING_INVITES,
    payload: { pendingInvites },
});

export const getPendingInvites = teamId => async (dispatch, getState) => {
    const { teams } = getState();
    if (!teams.pendingInvites || teams.pendingInvites.length === 0) {
        const token = await getAccessTokenSilently();

        dispatch(setPendingInvitesLoading(true));
        try {
            const result = await axios.get(`${BASE_URI}/team/${teamId}/invites/pending`, config(token));

            dispatch(setPendingInvites(result.data));
        } catch (error) {
            logError(error);
        } finally {
            dispatch(setPendingInvitesLoading(false));
        }
    }
};