import { ApiRequest } from "./candidates/actions";
import { JobsApiRequest } from "./jobs/actions";
import {
    CandidateDetails,
    CandidateChallenge,
    Interview,
    LibraryTemplate,
    SharedInterview,
    TeamDetails,
    TeamInvite,
    TeamMember,
    Template,
    UserProfile,
    Job, JobDetails, Candidate
} from "./models";
import { InterviewApiRequest } from "./interviews/actions";

export interface IApiResults extends Record<ApiRequest, IApiRequestResult> {}

export interface IJobsApiResults extends Record<JobsApiRequest, IApiRequestResult> {}

export interface IInterviewsApiResults extends Record<InterviewApiRequest, IApiRequestResult> {}

export enum ApiRequestStatus {
    NotSubmitted,
    InProgress,
    Success,
    Failed,
}

export interface IApiRequestResult {
    status: ApiRequestStatus;
    error?: string;
}

export interface RootState {
    user: UserState;
    team: TeamState;
    interviews: InterviewState;
    candidates: CandidateState;
    challenge: ChallengeState;
    templates: TemplateState;
    integration: IntegrationState;
    jobs: JobsState;
}

export interface UserState {
    profile: UserProfile;
    teamMembers: TeamMember[];
}

export interface TeamState {
    loading: false;
    details?: TeamDetails;
    pendingInvites: TeamInvite[];
}

export interface InterviewState {
    interviews: Interview[];
    interviewsShared: SharedInterview[];
    apiResults: IInterviewsApiResults;
}

export interface CandidateState {
    candidates: Candidate[];
    candidateDetails: CandidateDetails[];
    loading: boolean;
    error: boolean;
    uploadUrl?: string;
    apiResults: IApiResults;
}

export interface ChallengeState {
    details?: CandidateChallenge;
    loading: boolean;
    error: boolean;
    isExpired: boolean;
}

export interface TemplateState {
    templates: Template[];
    library: LibraryTemplate[];
    sharedTemplate: Template | undefined | null;
}

export interface IntegrationState {
    linkToken?: string;
    loading: boolean;
    error: boolean;
}

export interface JobsState {
    jobs: Job[];
    jobsDetail: JobDetails[];
    apiResults: IJobsApiResults;
}
