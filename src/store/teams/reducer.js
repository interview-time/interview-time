import { SET_PENDING_INVITES_LOADING, SET_PENDING_INVITES } from "./actions";
import { log } from "../../components/utils/log";

const initialState = {
    pendingInvites: [],
    pendingInvitesLoading: false,
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

        default:
            return state;
    }
};

export default teamsReducer;
