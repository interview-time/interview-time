import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";

export const SET_PENDING_INVITES_LOADING = "SET_PENDING_INVITES_LOADING";
export const SET_PENDING_INVITES = "SET_PENDING_INVITES";
export const SET_TEAM = "SET_TEAM";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const RESET_TEAM = "RESET_TEAM";
export const REMOVE_INVITE = "REMOVE_INVITE";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;


export const setPendingInvitesLoading = loading => ({
    type: SET_PENDING_INVITES_LOADING,
    payload: { loading },
});

export const setPendingInvites = pendingInvites => ({
    type: SET_PENDING_INVITES,
    payload: { pendingInvites },
});

export const loadPendingInvites =
    (teamId, forceFetch = false) =>
    async (dispatch, getState) => {
        const { team } = getState();

        if (!team.pendingInvites || team.pendingInvites.length === 0 || forceFetch) {
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

export const setTeam = team => ({
    type: SET_TEAM,
    payload: { team },
});

export const setLoading = loading => ({
    type: SET_LOADING,
    payload: { loading },
});

export const setError = error => ({
    type: SET_ERROR,
    payload: { error },
});

export const loadTeam =
    (teamId, forceFetch = false) =>
    async (dispatch, getState) => {
        const { team } = getState();

        if (!team.detail || forceFetch) {
            const token = await getAccessTokenSilently();

            dispatch(setLoading(true));
            dispatch(setError(false));

            try {
                const result = await axios.get(`${BASE_URI}/team/${teamId}`, config(token));

                dispatch(setTeam(result.data));
            } catch (error) {
                logError(error);
                dispatch(setError(true));
            } finally {
                dispatch(setLoading(false));
            }
        }
    };

export const cancelInvite = (teamId, inviteId) => async dispatch => {
    const token = await getAccessTokenSilently();
    try {
        dispatch(setError(false));
        dispatch(removeInvite(inviteId));

        await axios.delete(`${BASE_URI}/team/${teamId}/invite/${inviteId}`, config(token));
    } catch (error) {
        logError(error);
        dispatch(setError(true));
    }
};

export const removeInvite = inviteId => ({
    type: REMOVE_INVITE,
    payload: { inviteId },
});

export const resetTeam = () => ({
    type: RESET_TEAM,
});
