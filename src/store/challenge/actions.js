import axios from "axios";
import { logError } from "../../utils/log";
import { ChallengeStatus } from "../../utils/constants";

export const SET_CHALLENGE = "SET_CHALLENGE";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const SET_STATUS = "SET_STATUS";
export const SET_IS_EXPIRED = "SET_IS_EXPIRED";

const BASE_URI = `${process.env.REACT_APP_API_URL}`;

export const loadChallenge = token => async dispatch => {
    dispatch(setLoading(true));
    dispatch(setError(false));
    dispatch(setIsExpired(false));

    try {
        const result = await axios.get(`${BASE_URI}/challenge/${token}`);

        dispatch(setChallenge(result.data));
    } catch (error) {
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

export const setChallenge = challenge => ({
    type: SET_CHALLENGE,
    payload: { challenge },
});

export const setIsExpired = isExpired => ({
    type: SET_IS_EXPIRED,
    payload: { isExpired },
});

export const setLoading = loading => ({
    type: SET_LOADING,
    payload: { loading },
});

export const setError = isError => ({
    type: SET_ERROR,
    payload: { isError },
});

export const submitSolution = (token, gitHubUrl) => async dispatch => {
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

export const setStatus = status => ({
    type: SET_STATUS,
    payload: { status },
});
