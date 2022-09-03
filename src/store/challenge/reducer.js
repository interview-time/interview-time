import { SET_CHALLENGE, SET_LOADING, SET_ERROR, SET_STATUS } from "./actions";
import { log } from "../../utils/log";

const initialState = {
    details: null,
    loading: false,
    error: false,
};

const challengeReducer = (state = initialState, action) => {
    log(action.type);

    switch (action.type) {
        case SET_CHALLENGE: {
            const { challenge } = action.payload;
            return { ...state, details: challenge };
        }
        case SET_LOADING: {
            const { loading } = action.payload;
            return { ...state, loading: loading };
        }

        case SET_ERROR: {
            const { error } = action.payload;
            return { ...state, error: error };
        }

        case SET_STATUS: {
            const { status } = action.payload;
            return { ...state, details: { ...state.details, status: status } };
        }

        default:
            return state;
    }
};

export default challengeReducer;
