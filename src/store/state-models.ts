import { Candidate, Interview, TeamDetails, TeamInvite, TeamMember, UserProfile } from "./models";

export interface RootState {
    user: UserState;
    team: TeamState;
    interviews: InterviewState;
    candidates: CandidateState;
}

export interface UserState {
    profile: UserProfile;
    teamMembers: TeamMember[];
}

export interface TeamState {
    loading: false;
    details: TeamDetails;
    pendingInvites: TeamInvite[];
}

export interface InterviewState {
    interviews: Interview[];
    sharedScorecards: any[];
}

export interface CandidateState {
    candidates: Candidate[];
}
