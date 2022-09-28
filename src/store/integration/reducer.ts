import { IntegrationState } from "../state-models";
import { SET_LINK_TOKEN, SET_LINK_TOKEN_LOADING, SET_LINK_TOKEN_ERROR, RESET_INTEGRATION } from "./actions";
import { AnyAction } from "redux";

const initialState: IntegrationState = {
    linkToken: undefined,
    loading: false,
    error: false,
};

const integrationReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case SET_LINK_TOKEN_LOADING: {
            const { loading } = action.payload;
            return { ...state, loading: loading };
        }

        case SET_LINK_TOKEN_ERROR: {
            const { error } = action.payload;
            return { ...state, error: error };
        }

        case SET_LINK_TOKEN: {
            const { linkToken } = action.payload;
            return { ...state, linkToken: linkToken };
        }

        case RESET_INTEGRATION: {
            return { linkToken: undefined, loading: false, error: false };
        }

        default:
            return state;
    }
};

export default integrationReducer;
