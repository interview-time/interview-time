import {
    SET_CHALLENGE,
    SET_CHALLENGE_LOADING,
    SET_CHALLENGE_ERROR,
    SET_CHALLENGE_STATUS,
    SET_CHALLENGE_EXPIRED,
    RESET_CHALLENGE,
} from "./actions";
import { log } from "../../utils/log";

const initialState = {
    details: null,
    loading: false,
    error: false,
    isExpired: false,
};

const challengeReducer = (state = initialState, action) => {
    log(action.type);

    switch (action.type) {
        case RESET_CHALLENGE: {
            return { details: null, loading: false, error: false, isExpired: false };
        }

        case SET_CHALLENGE: {
            const { challenge } = action.payload;
            return { ...state, details: challenge };
        }

        case SET_CHALLENGE_LOADING: {
            const { loading } = action.payload;
            return { ...state, loading: loading };
        }

        case SET_CHALLENGE_ERROR: {
            const { error } = action.payload;
            return { ...state, error: error };
        }

        case SET_CHALLENGE_STATUS: {
            const { status } = action.payload;
            return { ...state, details: { ...state.details, status: status } };
        }

        case SET_CHALLENGE_EXPIRED: {
            const { isExpired } = action.payload;

            if (isExpired) {
                return { ...state, details: null, isExpired: isExpired };
            }

            return { ...state, isExpired: isExpired };
        }

        default:
            return state;
    }
};

export default challengeReducer;
