import { IntegrationState } from "../state-models";
import { IntegrationActions, IntegrationActionType } from "./actions";

const initialState: IntegrationState = {
    linkToken: undefined,
    loading: false,
    error: false,
};

const integrationReducer = (state = initialState, action: IntegrationActions) => {
    switch (action.type) {
        case IntegrationActionType.SET_LINK_TOKEN_LOADING: {
            return { ...state, loading: action.loading };
        }

        case IntegrationActionType.SET_LINK_TOKEN_ERROR: {
            return { ...state, error: action.error };
        }

        case IntegrationActionType.SET_LINK_TOKEN: {
            return { ...state, linkToken: action.linkToken };
        }

        case IntegrationActionType.RESET_INTEGRATION: {
            return { linkToken: undefined, loading: false, error: false };
        }

        default:
            return state;
    }
};

export default integrationReducer;
