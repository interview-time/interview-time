import {
    Candidate,
    Interview,
    LibraryTemplate, SharedInterview,
    TeamDetails,
    TeamInvite,
    TeamMember,
    Template,
    UserProfile
} from "./models";

export interface RootState {
    user: UserState;
    team: TeamState;
    interviews: InterviewState;
    candidates: CandidateState;
    templates: TemplateState;
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
    candidates: Candidate[];
}

export interface TemplateState {
    templates: Template[];
    library: LibraryTemplate[];
    sharedTemplate: Template | undefined | null;
}