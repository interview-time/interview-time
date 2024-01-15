import {
    SET_PENDING_INVITES_LOADING,
    SET_PENDING_INVITES,
    SET_TEAM,
    SET_LOADING,
    SET_ERROR,
    RESET_TEAM,
    REMOVE_INVITE,
} from "./actions";

const initialState = {
    pendingInvites: [],
    pendingInvitesLoading: false,
    loading: false,
    error: false,
    details: null,
};

const teamsReducer = (state = initialState, action) => {
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

        case REMOVE_INVITE: {
            const { inviteId } = action.payload;
            const newInvites = state.details.pendingInvites.filter(i => i.inviteId !== inviteId);

            return { ...state, details: { ...state.details, pendingInvites: newInvites } };
        }

        default:
            return state;
    }
};

export default teamsReducer;
