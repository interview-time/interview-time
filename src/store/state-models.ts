import { ApiRequest } from "./candidates/actions";
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
} from "./models";

export interface IApiResults extends Record<ApiRequest, IApiRequestResult> {}

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
    loading: boolean;
    uploading: boolean;
    generatingLink: boolean;
}

export interface CandidateState {
    candidates: CandidateDetails[];
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
