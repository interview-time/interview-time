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
    integration: Integration;
}

export interface Integration {
    status: string;
    ats?: string;
    lastSync: string;
}

export enum IntegrationStatus {
    None = "None",
    Completed = "Completed",
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
    interviewerName: string;
    interviewId: string;
    teamId: string;
    linkId: string;
    token?: string; // shared scorecard token
    candidateId: string;
    candidateName?: string; // DEPRECATED
    candidateNotes?: string;
    position?: string; // DEPRECATED
    interviewDateTime: string; // "2022-07-13T11:15:00Z"
    interviewEndDateTime: string; // "2022-07-13T12:15:00Z"
    templateIds: string[];
    status: InterviewStatus;
    decision: InterviewAssessment;
    notes?: string;
    redFlags?: RedFlag[];
    checklist?: InterviewChecklist[];
    isDemo: boolean;
    isShared: boolean;
    createdDate: string;
    modifiedDate: string;
    interviewers: string[];
    structure: InterviewStructure;
    interviewType: InterviewType;
    liveCodingChallenges?: LiveCodingChallenge[];
    takeHomeChallenge?: TakeHomeChallenge;
    challengeDetails?: ChallengeDetails;
    sendChallenge?: boolean;
}

export interface InterviewStage {
    stageName: string;
    linkId: string;
    interviewStartDate: string;
    interviews: Interview[];
}

export interface SharedInterview extends Interview {
    candidateName: string;
    interviewerName: string;
}

export interface RedFlag {
    order: number;
    label: string;
}

export enum InterviewAssessment {
    NONE = 0,
    YES = 1,
    NO = 2,
    STRONG_YES = 3,
    STRONG_NO = 4,
}

export interface InterviewStructure {
    header?: string;
    footer?: string;
    groups: InterviewStructureGroup[];
}

export interface InterviewStructureGroup {
    groupId: string;
    name: string;
    notes?: string;
    questions?: InterviewQuestion[];
}

export interface TemplateQuestion {
    questionId: string;
    question: string;
    difficulty: QuestionDifficulty;
    tags?: string[];
}

export interface InterviewQuestion extends TemplateQuestion {
    assessment: QuestionAssessment;
    notes?: string;
}

export interface Candidate {
    candidateId: string;
    candidateName: string;
    createdDate: string;
    position?: string;
    resumeUrl?: string;
    resumeFile?: string;
    status: string;
    gitHub?: string;
    linkedIn?: string;
    email?: string;
    phone?: string;
    archived: boolean;
    location: string;
    isFromATS: boolean;
    isAnonymised: boolean;
    tags: string[];
}

export interface CandidateDetails extends Candidate {
    stages: InterviewStage[];
}

export interface Job {
    jobId: string;
    title: string;
    department: string;
    location?: string;
    createdDate: string;
    status: string;
    totalCandidates: number;
    newlyAddedCandidates: number;
}

export interface JobDetails extends Job {
    description?: string;
    deadline?: string;
    tags: string[];
    owner: string;
    ownerName: string;
    pipeline: JobStage[];
}

export interface JobStage {
    stageId: string;
    title: string;
    description?: string;
    colour: string;
    type: string;
    templateId?: string;
    disabled: boolean;
    candidates?: JobCandidate[];
}

export interface JobCandidate {
    candidateId: string;
    name: string;
    position?: string;
    status: string;
    movedToStage: string;
    originallyAdded: string;
}
export enum JobStageType {
    Interview = "Interview",
    Regular = "Regular",
}

export enum QuestionAssessment {
    /**
     * Candidate wasn't able to answer the question.
     */
    UNANSWERED = -1,
    /**
     * Question wasn't asked.
     */
    NO_ASSESSMENT = 0,
    POOR = 1,
    GOOD = 2,
    EXCELLENT = 3,
}

export enum QuestionDifficulty {
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
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

export enum InterviewType {
    INTERVIEW = "INTERVIEW",
    LIVE_CODING = "LIVE_CODING",
    TAKE_HOME_TASK = "TAKE_HOME_TASK",
}

export interface InterviewChecklist {
    item: string;
    checked: boolean;
}

export interface Template {
    userId: string;
    templateId: string;
    parentId?: string;
    teamId: string;
    title: string;
    description: string;
    createdDate: string;
    structure: TemplateStructure;
    interviewType: InterviewType;
    challenges?: TemplateChallenge[];
    checklist?: InterviewChecklist[];
}

export interface LibraryTemplate {
    userId: string;
    libraryId: string;
    title: string;
    description: string;
    createdDate: string;
    modifiedDate: string;
    structure: TemplateStructure;
}

export interface SharedTemplate extends Template {
    token: string;
    isShared: boolean;
}

export interface TemplateStructure {
    header: string;
    footer: string;
    groups: TemplateGroup[];
}

export interface TemplateGroup {
    groupId: string;
    name: string;
    questions: TemplateQuestion[];
}

export interface TemplateChallenge {
    challengeId: string;
    name: string;
    description?: string;
    gitHubUrl?: string;
    fileName?: string;
    modifiedDate?: string;
}

export interface LiveCodingChallenge {
    challengeId: string;
    name: string;
    description?: string;
    gitHubUrl?: string;
    fileName?: string;
    selected?: boolean;
    shareToken?: string;
}

export interface TakeHomeChallenge {
    challengeId: string;
    name: string;
    description?: string;
    gitHubUrl?: string;
    fileName?: string;
    shareToken?: string;
    status?: ChallengeStatus;
    solutionGitHubUrls?: string[];
    sentToCandidateOn?: string;
    solutionSubmittedOn?: string;
}

export interface CandidateChallenge {
    challengeId: string;
    description?: string;
    gitHubUrl?: string;
    modifiedDate?: string;
    downloadFileUrl?: string;
    candidateName: string;
    status?: string;
}

export interface ChallengeDetails {
    challengeId: string;
}

export enum ChallengeStatus {
    NotSent = "NotSent",
    SentToCandidate = "SentToCandidate",
    SolutionSubmitted = "SolutionSubmitted",
}
