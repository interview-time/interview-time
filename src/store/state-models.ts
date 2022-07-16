import { TeamDetails, TeamInvite, UserProfile } from "./models";

export interface RootState {
    user?: UserState;
    team?: TeamState;
}

export interface UserState {
    profile: UserProfile;
}

export interface TeamState {
    loading: false;
    error: false;
    details: TeamDetails;
    pendingInvitesLoading: false;
    pendingInvites: TeamInvite[];
}
