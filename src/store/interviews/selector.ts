import { RootState } from "../state-models";
import { Candidate, Interview, TeamMember } from "../models";
import { Status } from "../../utils/constants";

export interface InterviewData extends Interview {
    candidate?: Candidate;
    interviewerMember?: TeamMember;
    interviewersMember: TeamMember[];
    startDateTime: Date;
    endDateTime: Date;
    createdDateTime: Date;
    linkedInterviews: InterviewData[];
}

export const selectInterviewData = (state: RootState): InterviewData[] => {
    const interviews = state.interviews.interviews ?? [];
    const candidates = state.candidates.candidates ?? [];
    const teamMembers = state.user.teamMembers ?? [];

    return interviews.map((interview: Interview) => {
        const interviewers = interview.interviewers ?? [interview.userId]; // backward compat
        return {
            ...interview,
            interviewers: interviewers,
            candidate: candidates.find(candidate => candidate.candidateId === interview.candidateId),
            interviewerMember: teamMembers.find(teamMember => teamMember.userId === interview.userId),
            interviewersMember: teamMembers.filter(teamMember => interviewers.includes(teamMember.userId)),
            startDateTime: new Date(interview.interviewDateTime),
            endDateTime: new Date(interview.interviewEndDateTime),
            createdDateTime: new Date(interview.createdDate),
            linkedInterviews: [],
        };
    });
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
    const interviews = selectInterviewData(state).filter(
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

    selectInterviewData(state)
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
    const interviews = selectInterviewData(state).filter(
        (interview: InterviewData) => interview.candidateId === candidateId
    );

    return selectSortedByDateInterviews(interviews, true);
};

export const selectInterview = (state: RootState, interviewId: string) => {
    return state.interviews.interviews.find(interview => interview.interviewId === interviewId);
};

export const selectSharedScorecard = (state: RootState, token: string) => {
    return state.interviews.sharedScorecards.find(scorecard => scorecard.token === token);
};
