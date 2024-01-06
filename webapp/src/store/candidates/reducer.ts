import { ApiRequest, CandidateActions, CandidateActionType } from "./actions";
import { ApiRequestStatus, CandidateState, IApiRequestResult, IApiResults } from "../state-models";

const defaultApiRequest: IApiRequestResult = {
    status: ApiRequestStatus.NotSubmitted,
    error: undefined,
};

export const defaultApiResults: IApiResults = {
    [ApiRequest.GetCandidateList]: defaultApiRequest,
    [ApiRequest.GetCandidateDetails]: defaultApiRequest,
    [ApiRequest.UpdateCandidate]: defaultApiRequest,
    [ApiRequest.CreateCandidate]: defaultApiRequest,
    [ApiRequest.DeleteCandidate]: defaultApiRequest,
    [ApiRequest.ArchiveCandidate]: defaultApiRequest,
};

const initialState: CandidateState = {
    candidates: [],
    candidateDetails: [],
    uploadUrl: undefined,
    loading: false,
    error: false,
    apiResults: defaultApiResults,
};

const candidatesReducer = (state = initialState, action: CandidateActions) => {
    switch (action.type) {
        case CandidateActionType.SET_CANDIDATE_LIST: {
            return {
                ...state,
                candidates: action.candidates,
            };
        }

        case CandidateActionType.SET_CANDIDATE_DETAILS: {
            const otherCandidates = state.candidateDetails.filter(
                c => c.candidateId !== action.candidateDetails.candidateId
            );

            return {
                ...state,
                candidateDetails: [...otherCandidates, action.candidateDetails],
            };
        }

        case CandidateActionType.SET_LOADING: {
            return {
                ...state,
                loading: action.loading,
            };
        }

        case CandidateActionType.SET_ERROR: {
            return {
                ...state,
                error: action.isError,
            };
        }

        case CandidateActionType.SET_UPLOAD_URL: {
            return {
                ...state,
                uploadUrl: action.uploadUrl,
            };
        }

        case CandidateActionType.REMOVE_CANDIDATE: {
            return {
                ...state,
                candidates: state.candidates.filter(item => item.candidateId !== action.candidateId),
            };
        }

        case CandidateActionType.SET_ARCHIVE_CANDIDATE: {
            const candidates = state.candidates.map(item => {
                if (item.candidateId === action.candidateId) {
                    return {
                        ...item,
                        archived: action.archived,
                    };
                }

                return item;
            });

            return {
                ...state,
                candidates: candidates,
            };
        }

        case CandidateActionType.SET_REQUEST_SUCCESS: {
            return {
                ...state,
                apiResults: { ...state.apiResults, [action.requestType]: { status: ApiRequestStatus.Success } },
            };
        }

        case CandidateActionType.SET_REQUEST_IN_PROGRESS: {
            return {
                ...state,
                apiResults: { ...state.apiResults, [action.requestType]: { status: ApiRequestStatus.InProgress } },
            };
        }

        case CandidateActionType.SET_REQUEST_FAILED: {
            return {
                ...state,
                apiResults: {
                    ...state.apiResults,
                    [action.requestType]: { status: ApiRequestStatus.Failed, error: action.error },
                },
            };
        }

        case CandidateActionType.SET_REQUEST_RESET: {
            return {
                ...state,
                apiResults: { ...state.apiResults, [action.requestType]: { status: ApiRequestStatus.NotSubmitted } },
            };
        }

        default:
            return state;
    }
};

export default candidatesReducer;
