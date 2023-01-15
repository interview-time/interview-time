import { InterviewActions, InterviewActionType, InterviewApiRequest } from "./actions";
import { ApiRequestStatus, IApiRequestResult, IInterviewsApiResults, InterviewState } from "../state-models";

const defaultApiRequest: IApiRequestResult = {
    status: ApiRequestStatus.NotSubmitted,
    error: undefined,
};

export const defaultApiResults: IInterviewsApiResults = {
    [InterviewApiRequest.GetInterviews]: defaultApiRequest,
    [InterviewApiRequest.AddInterview]: defaultApiRequest,
    [InterviewApiRequest.UpdateInterview]: defaultApiRequest,
    [InterviewApiRequest.DeleteInterview]: defaultApiRequest,
    [InterviewApiRequest.ShareScorecard]: defaultApiRequest,
    [InterviewApiRequest.UnshareScorecard]: defaultApiRequest,
    [InterviewApiRequest.GetSharedScorecard]: defaultApiRequest,
};

const initialState: InterviewState = {
    interviews: [],
    interviewsShared: [],
    apiResults: defaultApiResults,
};

const interviewsReducer = (state = initialState, action: InterviewActions) => {
    switch (action.type) {
        case InterviewActionType.SET_INTERVIEWS: {
            return {
                ...state,
                interviews: action.interviews,
            };
        }

        case InterviewActionType.SET_NEW_INTERVIEW: {
            const otherInterviews = state.interviews.filter(c => c.interviewId !== action.interview.interviewId);

            return {
                ...state,
                interviews: [...otherInterviews, action.interview],
            };
        }

        case InterviewActionType.SET_UPDATED_INTERVIEW: {
            return {
                ...state,
                interviews: state.interviews.map(interview =>
                    interview.interviewId === action.interview.interviewId ? action.interview : interview
                ),
            };
        }

        case InterviewActionType.SET_REMOVED_INTERVIEW: {
            return {
                ...state,
                interviews: state.interviews.filter(c => c.interviewId !== action.interviewId),
            };
        }

        case InterviewActionType.SET_REQUEST_SUCCESS: {
            return {
                ...state,
                apiResults: { ...state.apiResults, [action.requestType]: { status: ApiRequestStatus.Success } },
            };
        }

        case InterviewActionType.SET_REQUEST_IN_PROGRESS: {
            return {
                ...state,
                apiResults: { ...state.apiResults, [action.requestType]: { status: ApiRequestStatus.InProgress } },
            };
        }

        case InterviewActionType.SET_REQUEST_FAILED: {
            return {
                ...state,
                apiResults: {
                    ...state.apiResults,
                    [action.requestType]: { status: ApiRequestStatus.Failed, error: action.error },
                },
            };
        }

        case InterviewActionType.SET_REQUEST_RESET: {
            return {
                ...state,
                apiResults: { ...state.apiResults, [action.requestType]: { status: ApiRequestStatus.NotSubmitted } },
            };
        }

        case InterviewActionType.SET_SHARED_INTERVIEW: {
            return {
                ...state,
                interviews: state.interviews.map(interview => {
                    if (interview.interviewId === action.interviewId) {
                        return { ...interview, isShared: true, token: action.shareToken };
                    } else {
                        return interview;
                    }
                }),
            };
        }

        case InterviewActionType.SET_UNSHARED_INTERVIEW: {
            return {
                ...state,
                interviews: state.interviews.map(interview => {
                    if (interview.interviewId === action.interviewId) {
                        return { ...interview, isShared: false, token: undefined };
                    } else {
                        return interview;
                    }
                }),
            };
        }

        case InterviewActionType.SET_CACHE_SHARED_INTERVIEW: {
            return {
                ...state,
                interviewsShared: [
                    ...state.interviewsShared.filter(scorecard => scorecard.token !== action.shareToken),
                    { ...action.interview, token: action.shareToken },
                ],
            };
        }

        default:
            return state;
    }
};

export default interviewsReducer;
