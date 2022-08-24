import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";

export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const SET_CANDIDATES = "SET_CANDIDATES";
export const CREATE_CANDIDATE = "CREATE_CANDIDATE";
export const UPDATE_CANDIDATE = "UPDATE_CANDIDATE";
export const DELETE_CANDIDATE = "DELETE_CANDIDATE";
export const GET_UPLOAD_URL = "GET_UPLOAD_URL";
export const SET_UPLOAD_URL = "SET_UPLOAD_URL";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

export const setLoading = loading => ({
    type: SET_LOADING,
    payload: { loading },
});

export const setError = isError => ({
    type: SET_ERROR,
    payload: { isError },
});

export const loadCandidates =
    (forceFetch = false) =>
    async (dispatch, getState) => {
        const { user, candidates } = getState();

        if (forceFetch || (candidates.candidates.length === 0 && !candidates.loading)) {
            const token = await getAccessTokenSilently();
            const teamId = user.profile.currentTeamId;

            dispatch(setLoading(true));
            dispatch(setError(false));

            try {
                const result = await axios.get(`${BASE_URI}/team/${teamId}/candidates`, config(token));

                dispatch(setCandidates(result.data?.candidates ?? []));
            } catch (error) {
                logError(error);
                dispatch(setError(true));
            } finally {
                dispatch(setLoading(false));
            }
        }
    };

export const setCandidates = candidates => ({
    type: SET_CANDIDATES,
    payload: {
        candidates,
    },
});

export const setUploadUrl = uploadUrl => ({
    type: SET_UPLOAD_URL,
    payload: {
        uploadUrl,
    },
});

export function getUploadUrl(candidateId, filename) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: GET_UPLOAD_URL,
            payload: {
                candidateId: candidateId,
                filename: filename,
                teamId: user.profile.currentTeamId,
            },
        });
    };
}

export function createCandidate(candidate) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: CREATE_CANDIDATE,
            payload: {
                candidate: candidate,
                teamId: user.profile.currentTeamId,
            },
        });
    };
}

export function updateCandidate(candidate) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: UPDATE_CANDIDATE,
            payload: {
                candidate: candidate,
                teamId: user.profile.currentTeamId,
            },
        });
    };
}

export function deleteCandidate(candidateId) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: DELETE_CANDIDATE,
            payload: {
                candidateId: candidateId,
                teamId: user.profile.currentTeamId,
            },
        });
    };
}
