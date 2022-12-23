import { JobsApiRequest, JobActions, JobActionType } from "./actions";
import { ApiRequestStatus, JobsState, IApiRequestResult, IJobsApiResults } from "../state-models";

const defaultApiRequest: IApiRequestResult = {
    status: ApiRequestStatus.NotSubmitted,
    error: undefined,
};

export const defaultApiResults: IJobsApiResults = {
    [JobsApiRequest.CreateJob]: defaultApiRequest,
    [JobsApiRequest.GetJobs]: defaultApiRequest,
    [JobsApiRequest.GetJobDetails]: defaultApiRequest,
};

const initialState: JobsState = {
    jobs: [],
    apiResults: defaultApiResults,
};

const candidatesReducer = (state = initialState, action: JobActions) => {
    switch (action.type) {
        case JobActionType.SET_JOBS: {
            return {
                ...state,
                jobs: action.jobs,
            };
        }

        case JobActionType.SET_JOB_DETAILS: {
            const otherCandidates = state.jobs.filter(c => c.jobId !== action.job.jobId);

            return {
                ...state,
                candidates: [...otherCandidates, action.job],
            };
        }

        case JobActionType.SET_REQUEST_SUCCESS: {
            return {
                ...state,
                apiResults: { ...state.apiResults, [action.requestType]: { status: ApiRequestStatus.Success } },
            };
        }

        case JobActionType.SET_REQUEST_IN_PROGRESS: {
            return {
                ...state,
                apiResults: { ...state.apiResults, [action.requestType]: { status: ApiRequestStatus.InProgress } },
            };
        }

        case JobActionType.SET_REQUEST_FAILED: {
            return {
                ...state,
                apiResults: {
                    ...state.apiResults,
                    [action.requestType]: { status: ApiRequestStatus.Failed, error: action.error },
                },
            };
        }

        case JobActionType.SET_REQUEST_RESET: {
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
