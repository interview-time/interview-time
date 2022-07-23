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

export interface Interview {
    userId: string;
    interviewId: string;
    teamId: string;
    linkId: string;
    candidateId: string;
    candidateNotes?: string;
    position?: string;
    interviewDateTime: string; // "2022-07-13T11:15:00Z"
    interviewEndDateTime: string; // "2022-07-13T12:15:00Z"
    templateIds: string[];
    status: "NEW" | "STARTED" | "COMPLETED" | "SUBMITTED"; // TODO migrate to enum
    decision: 0 | 1 | 2 | 3 | 4; // TODO migrate to enum
    notes?: string;
    redFlags?: string[];
    isDemo: boolean;
    isShared: boolean;
    createdDate: string;
    modifiedDate: string;
    interviewers: string[];
    structure: InterviewStructure;
}

export interface InterviewStructure {
    header?: string;
    footer?: string;
    groups?: InterviewStructureGroup[];
}

export interface InterviewStructureGroup {
    groupId: string;
    name: string;
    notes?: string;
    questions?: InterviewQuestion[];
}

export interface InterviewQuestion {
    questionId: string;
    question: string;
    difficulty: "Easy" | "Medium" | "Hard"; // TODO migrate to enum
    assessment: -1 | 0 | 1 | 2 | 3; // TODO migrate to enum
    notes?: string;
    tags?: string[];
}

export interface Candidate {
    candidateId: string;
    candidateName: string;
    createdDate: string;
    position?: string;
    resumeUrl?: string;
    status: string;
    codingRepo?: string;
    gitHub?: string;
    linkedIn?: string;
    archived: boolean;
}

export enum TeamRole {
    HR = "HR",
    HIRING_MANAGER = "HIRING_MANAGER",
    INTERVIEWER = "INTERVIEWER",
    ADMIN = "ADMIN",
}

export enum InterviewStatus {
    NEW = "NEW",
    STARTED = "STARTED",
    COMPLETED = "COMPLETED",
    SUBMITTED = "SUBMITTED",
}
