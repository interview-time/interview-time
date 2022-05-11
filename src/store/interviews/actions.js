import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import { logError } from "../../components/utils/log";

export const LOAD_INTERVIEWS = "LOAD_INTERVIEWS";
export const SET_INTERVIEWS = "SET_INTERVIEWS";
export const SET_UPLOADING = "SET_UPLOADING";
export const ADD_INTERVIEW = "ADD_INTERVIEW";
export const UPDATE_INTERVIEW = "UPDATE_INTERVIEW";
export const DELETE_INTERVIEW = "DELETE_INTERVIEW";
export const UPDATE_SCORECARD = "UPDATE_SCORECARD";
export const SHARE_SCORECARD = "SHARE_SCORECARD";
export const UNSHARE_SCORECARD = "UNSHARE_SCORECARD";
export const SET_SHARED_SCORECARD = "SET_SHARED_SCORECARD";
export const REQUEST_STARTED = "REQUEST_STARTED";
export const REQUEST_FINISHED = "REQUEST_FINISHED";

const BASE_URL = `${process.env.REACT_APP_API_URL}`;

export function loadInterviews(forceFetch = false) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: LOAD_INTERVIEWS,
            payload: {
                forceFetch: forceFetch,
                teamId: user.profile.currentTeamId,
            },
        });
    };
}

export const setInterviews = interviews => ({
    type: SET_INTERVIEWS,
    payload: {
        interviews,
    },
});

export const setUploading = uploading => ({
    type: SET_UPLOADING,
    payload: {
        uploading,
    },
});

export function addInterview(interview) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: ADD_INTERVIEW,
            payload: {
                interview: interview,
                teamId: user.profile.currentTeamId,
            },
        });
    };
}

export const updateScorecard = interview => ({
    type: UPDATE_SCORECARD,
    payload: {
        interview,
    },
});

export const updateInterview = interview => ({
    type: UPDATE_INTERVIEW,
    payload: {
        interview,
    },
});

export const deleteInterview = interviewId => ({
    type: DELETE_INTERVIEW,
    payload: {
        interviewId,
    },
});

export const shareScorecard = interviewId => async dispatch => {
    try {
        const authToken = await getAccessTokenSilently();

        const request = {
            interviewId: interviewId,
        };

        const result = await axios.patch(`${BASE_URL}/scorecard/share`, request, config(authToken));

        if (result.data) {
            dispatch({
                type: SHARE_SCORECARD,
                payload: {
                    interviewId,
                    token: result.data.token,
                },
            });
        }
    } catch (error) {
        logError(error);
    }
};

export const unshareScorecard = interviewId => async dispatch => {
    try {
        const authToken = await getAccessTokenSilently();

        const request = {
            interviewId: interviewId,
        };

        await axios.patch(`${BASE_URL}/scorecard/unshare`, request, config(authToken));

        dispatch({
            type: UNSHARE_SCORECARD,
            payload: {
                interviewId,
            },
        });
    } catch (error) {
        logError(error);
    }
};

export const getSharedScorecard = token => async dispatch => {
    try {
        dispatch(requestStarted());

        const authToken = await getAccessTokenSilently();
        const scorecard = await axios.get(`${BASE_URL}/public/scorecard/${token}`, config(authToken));

        dispatch({
            type: SET_SHARED_SCORECARD,
            payload: {
                token,
                scorecard,
            },
        });
    } catch (error) {
        logError(error);
    } finally {
        dispatch(requestFinished());
    }
};

export const requestStarted = () => ({
    type: REQUEST_STARTED,
});

export const requestFinished = () => ({
    type: REQUEST_FINISHED,
});
