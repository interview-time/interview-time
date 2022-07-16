export interface TeamDetails {
    teamId: string;
    teamName: string;
    token: string;
    plan: string;
    seats: number;
    availableSeats: number;
    pendingInvites: TeamInvite[];
    roles: string[];
    teamMembers: TeamMember[];
}

export interface TeamMember {
    userId: string;
    name: string;
    email: string;
    isAdmin: boolean;
    roles: string[];
}

export interface TeamInvite {
    inviteId: string;
    inviteeEmail: string;
    invitedBy: string;
    role: string;
    invitedDate: string;
}

export interface UserProfile {
    name: string;
    email: string;
    userId: string;
    position: string;
    currentTeamId: string;
    timezoneOffset: number;
    timezone: string;
    teams: Team[];
}

export interface Team {
    teamId: string;
    teamName: string;
    token: string;
    roles: string[];
}
