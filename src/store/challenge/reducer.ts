import { log } from "../../utils/log";
import { ChallengeState } from "../state-models";
import { ChallengeActions, ChallengeActionType } from "./actions";

const initialState: ChallengeState = {
    details: undefined,
    loading: false,
    error: false,
    isExpired: false,
};

const challengeReducer = (state = initialState, action: ChallengeActions) => {
    log(action.type);

    switch (action.type) {
        case ChallengeActionType.RESET_CHALLENGE: {
            return { details: null, loading: false, error: false, isExpired: false };
        }

        case ChallengeActionType.SET_CHALLENGE: {
            return { ...state, details: action.challenge };
        }

        case ChallengeActionType.SET_CHALLENGE_LOADING: {
            return { ...state, loading: action.loading };
        }

        case ChallengeActionType.SET_CHALLENGE_ERROR: {
            return { ...state, error: action.isError };
        }

        case ChallengeActionType.SET_CHALLENGE_STATUS: {
            return { ...state, details: { ...state.details, status: action.status } };
        }

        case ChallengeActionType.SET_CHALLENGE_EXPIRED: {
            if (action.isExpired) {
                return { ...state, details: null, isExpired: action.isExpired };
            }

            return { ...state, isExpired: action.isExpired };
        }

        default:
            return state;
    }
};

export default challengeReducer;
