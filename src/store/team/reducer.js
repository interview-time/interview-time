import {
    SET_PENDING_INVITES_LOADING,
    SET_PENDING_INVITES,
    SET_TEAM,
    SET_LOADING,
    SET_ERROR,
    RESET_TEAM,
} from "./actions";
import { log } from "../../utils/log";

const initialState = {
    pendingInvites: [],
    pendingInvitesLoading: false,
    loading: false,
    error: false,
    details: null,
};

const teamsReducer = (state = initialState, action) => {
    log(action.type);

    switch (action.type) {
        case SET_PENDING_INVITES_LOADING: {
            const { loading } = action.payload;
            return { ...state, pendingInvitesLoading: loading };
        }

        case SET_PENDING_INVITES: {
            const { pendingInvites } = action.payload;
            return { ...state, pendingInvites: pendingInvites };
        }

        case SET_LOADING: {
            const { loading } = action.payload;
            return { ...state, loading: loading };
        }

        case SET_ERROR: {
            const { error } = action.payload;
            return { ...state, error: error };
        }

        case SET_TEAM: {
            const { team } = action.payload;
            return { ...state, details: team };
        }

        case RESET_TEAM: {
            return { ...state, details: null, loading: false, error: false };
        }

        default:
            return state;
    }
};

export default teamsReducer;
