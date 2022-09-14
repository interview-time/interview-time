import { RootState } from "../state-models";
import { Candidate, Interview, InterviewStructureGroup, InterviewType, TeamMember } from "../models";
import { Status } from "../../utils/constants";
import { cloneDeep } from "lodash";

export interface InterviewData extends Interview {
    candidate?: Candidate;
    interviewerMember?: TeamMember;
    interviewersMember: TeamMember[];
    startDateTime: Date;
    endDateTime: Date;
    createdDateTime: Date;
    linkedInterviews: InterviewData[];
}

export const toInterview = (interviewData: InterviewData): Interview => {
    const interview = cloneDeep(interviewData);
    delete interview.candidate;
    delete interview.interviewerMember;
    // @ts-ignore
    delete interview.interviewersMember;
    // @ts-ignore
    delete interview.linkedInterviews;
    return interview;
}

const toInterviewData = (interview: Interview, candidates: Candidate[], teamMembers: TeamMember[]) => {
    const interviewers = interview.interviewers ?? [interview.userId]; // backward compat
    const candidate = candidates.find(candidate => candidate.candidateId === interview.candidateId);
    if (candidate && !candidate.position) {
        candidate.position = interview.position; // backward compat
    }
    return {
        ...interview,
        interviewers: interviewers,
        candidate: candidate,
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

export const selectInterviewsData = (state: RootState): InterviewData[] => {
    const interviews = state.interviews.interviews ?? [];
    const candidates = state.candidates.candidates ?? [];
    const teamMembers = state.user.teamMembers ?? [];

    return interviews.map((interview: Interview) => toInterviewData(interview, candidates, teamMembers));
};

export const selectSortedByDateInterviews = (interviews: InterviewData[], desc: boolean = false): InterviewData[] => {
    return interviews.sort((a: InterviewData, b: InterviewData) => {
        const first: Date = a.startDateTime.getFullYear() > 1 ? a.startDateTime : a.createdDateTime;
        const second: Date = b.startDateTime.getFullYear() > 1 ? b.startDateTime : b.createdDateTime;

        // @ts-ignore
        return desc ? second - first : first - second;
    });
};

/**
 *
 * @return flat interview list.
 */
export const selectCompletedInterviewData = (state: RootState): InterviewData[] => {
    const interviews = selectInterviewsData(state).filter(
        (interview: InterviewData) => interview.status === Status.SUBMITTED
    );

    return selectSortedByDateInterviews(interviews, true);
};

/**
 * This function returns all interviews that are not submitted. Interviews are grouped by `linkId`, where root
 * interview always belongs to current user and co-interviews are present in `linkedInterviews` array.
 *
 * @return interview list with `linkedInterviews`.
 */
export const selectUncompletedInterviewData = (state: RootState): InterviewData[] => {
    const groupedInterviews: InterviewData[] = [];

    selectInterviewsData(state)
        .filter((interview: InterviewData) => interview.status !== Status.SUBMITTED)
        .sort((a: InterviewData, b: InterviewData) =>
            // sort interviews by `userId`, so that co interviewers will appear in `linkedInterviews`
            a.userId === state.user.profile.userId ? -1 : b.userId === state.user.profile.userId ? 1 : 0
        )
        .forEach(interview => {
            if (interview.linkId) {
                let existingGroup = groupedInterviews.find(group => group.linkId === interview.linkId);
                if (existingGroup) {
                    existingGroup.linkedInterviews.push(interview);
                } else {
                    groupedInterviews.push(interview);
                }
            } else {
                groupedInterviews.push(interview);
            }
        });

    return selectSortedByDateInterviews(groupedInterviews);
};

export const selectCandidateInterviewData = (state: RootState, candidateId: string) => {
    const interviews = selectInterviewsData(state).filter(
        (interview: InterviewData) => interview.candidateId === candidateId
    );

    return selectSortedByDateInterviews(interviews, true);
};

export const selectInterview = (state: RootState, interviewId: string) => {
    return state.interviews.interviews.find(interview => interview.interviewId === interviewId);
};

export const selectSharedInterview = (state: RootState, token: string) => {
    return state.interviews.interviewsShared.find(interview => interview.token === token);
};

export const selectAssessmentGroup = (interview: Interview): InterviewStructureGroup => interview.structure.groups[0]!;
