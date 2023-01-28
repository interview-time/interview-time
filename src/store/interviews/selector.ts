import { cloneDeep } from "lodash";
import { Candidate, Interview, InterviewStatus, InterviewStructureGroup, InterviewType, TeamMember } from "../models";
import { RootState } from "../state-models";

export interface LinkedInterviews {
    linkId: string;
    interviews: Interview[];
}

export interface InterviewData extends Interview {
    candidateDetails?: Candidate;
    interviewerMember?: TeamMember;
    interviewersMember: TeamMember[];
    startDateTime: Date;
    endDateTime: Date;
    createdDateTime: Date;
    linkedInterviews: InterviewData[];
}

export const toInterview = (interviewData: InterviewData): Interview => {
    const interview = cloneDeep(interviewData);
    delete interview.candidateDetails;
    delete interview.interviewerMember;
    // @ts-ignore
    delete interview.interviewersMember;
    // @ts-ignore
    delete interview.linkedInterviews;
    return interview;
};

const toInterviewData = (interview: Interview, candidates: Candidate[], teamMembers: TeamMember[]) => {
    const interviewers = interview.interviewers ?? [interview.userId]; // backward compat
    const candidate = candidates.find(candidate => candidate.candidateId === interview.candidateId);
    if (candidate && !candidate.position) {
        candidate.position = interview.position; // backward compat
    }
    return {
        ...interview,
        interviewers: interviewers,
        candidateDetails: candidate,
        interviewType: interview.interviewType ?? InterviewType.INTERVIEW, // backward compat
        interviewerMember: teamMembers.find(teamMember => teamMember.userId === interview.userId),
        interviewersMember: teamMembers.filter(teamMember => interviewers.includes(teamMember.userId)),
        startDateTime: new Date(interview.interviewDateTime),
        endDateTime: new Date(interview.interviewEndDateTime),
        createdDateTime: new Date(interview.createdDate),
        linkedInterviews: [],
    };
};

export const selectInterviewData = (state: RootState, interviewId: string) => {
    const candidates = state.candidates.candidates ?? [];
    const teamMembers = state.user.teamMembers ?? [];

    const interview = selectInterview(state, interviewId);
    if (interview) {
        return toInterviewData(interview, candidates, teamMembers);
    }
};

export const selectUncompletedUserInterviews = (state: RootState): Interview[] => {
    return state.interviews.interviews
        .filter(interview => interview.userId === state.user.profile.userId && interview.status !== InterviewStatus.SUBMITTED)
        .map(mapParsedDateTime)
        .map(interview => mapCandidateName(interview, state.candidates.candidates))
        .sort((a: Interview, b: Interview) => dateComparator(a, b));
};

export const selectUncompletedJobInterviews =
    (jobId: string) =>
    (state: RootState): LinkedInterviews[] => {
        const interviews = state.interviews.interviews
            .filter(interview => interview.jobId === jobId && interview.status !== InterviewStatus.SUBMITTED)
            .map(mapParsedDateTime)
            .map(interview => mapCandidateName(interview, state.candidates.candidates))
            .sort((a: Interview, b: Interview) => dateComparator(a, b));

        // group by linkId
        const linkedInterviewsMap = new Map<string, Interview[]>();
        interviews.forEach(interview => {
            let linkedInterviews = linkedInterviewsMap.get(interview.linkId);
            if (linkedInterviews) {
                linkedInterviews.push(interview);
            } else {
                linkedInterviewsMap.set(interview.linkId, [interview]);
            }
        });

        const linkedInterviews: LinkedInterviews[] = [];
        linkedInterviewsMap.forEach((value: Interview[], key: string) => {
            linkedInterviews.push({ linkId: key, interviews: value });
        });
        return linkedInterviews;
    };

export const selectCompletedInterviews = (state: RootState): Interview[] => {
    return state.interviews.interviews
        .filter(interview => interview.status === InterviewStatus.SUBMITTED)
        .map(mapParsedDateTime)
        .map(interview => mapCandidateName(interview, state.candidates.candidates))
        .sort((a: Interview, b: Interview) => dateComparator(a, b));
};

const mapParsedDateTime = (interview: Interview): Interview => {
    interview.parsedCreatedDateTime = new Date(interview.createdDate);
    interview.parsedStartDateTime = new Date(interview.interviewDateTime);
    interview.parsedEndDateTime = new Date(interview.interviewEndDateTime);
    return interview;
};

// backward compat, old interviews doesn't have 'candidate' field
const mapCandidateName = (interview: Interview, candidates: Candidate[]): Interview => {
    let candidateName = interview.candidate ?? interview.candidateName;
    if (!candidateName) {
        candidateName = candidates.find(candidate => candidate.candidateId === interview.candidateId)?.candidateName;
    }
    interview.candidate = candidateName;
    return interview;
};

const dateComparator = (a: Interview, b: Interview, desc: boolean = false) => {
    const first: Date = a.parsedStartDateTime.getFullYear() > 1 ? a.parsedStartDateTime : a.parsedCreatedDateTime;
    const second: Date = b.parsedStartDateTime.getFullYear() > 1 ? b.parsedStartDateTime : b.parsedCreatedDateTime;

    // @ts-ignore
    return desc ? second - first : first - second;
};

export const selectInterview = (state: RootState, interviewId: string) => {
    return state.interviews.interviews.find(interview => interview.interviewId === interviewId);
};

export const selectSharedInterview = (state: RootState, token: string) => {
    return state.interviews.interviewsShared.find(interview => interview.token === token);
};

export const selectAssessmentGroup = (interview: Interview): InterviewStructureGroup => interview.structure.groups[0]!;

export const getCandidateName2 = (interview: Interview, candidate?: Candidate) => {
    return candidate?.candidateName ?? interview.candidateName ?? "Unknown";
};

export const selectGetInterviewsStatus = (state: RootState) => state.interviews.apiResults.GetInterviews.status;

export const selectAddInterviewStatus = (state: RootState) => state.interviews.apiResults.AddInterview.status;

export const selectUpdateInterviewStatus = (state: RootState) => state.interviews.apiResults.UpdateInterview.status;

export const selectCancelInterviewStatus = (state: RootState) => state.interviews.apiResults.CancelInterview.status;
