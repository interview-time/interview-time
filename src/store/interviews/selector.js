import { Status } from "../../components/utils/constants";

export const selectInterview = (state, interviewId) => {
    return state.interviews.interviews.find(i => i.interviewId === interviewId);
};

export const selectInterviews = state => {
    const plainInterviews = state.interviews.interviews;
    const candidates = state.candidates.candidates;
    const teamMembers = state.user.teamMembers;

    const interviewsList = [];

    return plainInterviews.reduce((prev, scorecard) => {
        const interview = prev.find(i => scorecard.linkId && i.linkId === scorecard.linkId);

        if (!interview) {
            interviewsList.push({
                candidate:
                    candidates.find(c => c.candidateId === scorecard.candidateId)?.candidateName ?? scorecard.candidate,
                candidateId: scorecard.candidateId,
                interviewStartDateTime: new Date(scorecard.interviewDateTime),
                interviewEndDateTime: new Date(scorecard.interviewEndDateTime),
                interviewers: scorecard.interviewers
                    ? teamMembers.filter(user => scorecard.interviewers.includes(user.userId))
                    : [teamMembers.find(user => user.userId === scorecard.userId)],
                isDemo: scorecard.isDemo,
                linkId: scorecard.linkId,
                position: scorecard.position,
                scorecards: [
                    {
                        interviewId: scorecard.interviewId,
                        status: scorecard.status,
                        interviewer: teamMembers.find(user => user.userId === scorecard.userId),
                        decision: scorecard.decision,
                        structure: scorecard.structure,
                        notes: scorecard.notes,
                        modifiedDate: new Date(scorecard.modifiedDate),
                    },
                ],
                createdDate: new Date(scorecard.createdDate),
            });
        } else {
            interview.scorecards.push({
                interviewId: scorecard.interviewId,
                status: scorecard.status,
                interviewer: teamMembers.find(user => user.userId === scorecard.userId),
                decision: scorecard.decision,
                structure: scorecard.structure,
                notes: scorecard.notes,
                modifiedDate: new Date(scorecard.modifiedDate),
            });
        }

        return interviewsList;
    }, []);
};

export const selectSortedByDateInterviews = (interviews, desc = false) => {
    return interviews.sort((a, b) => {
        const first = a.interviewStartDateTime.getFullYear() > 1 ? a.interviewStartDateTime : a.createdDate;
        const second = b.interviewStartDateTime.getFullYear() > 1 ? b.interviewStartDateTime : b.createdDate;

        return desc ? second - first : first - second;
    });
};

export const selectInterviewsTable = (interviews, profile) => {
    return interviews.map(interview => {
        const scorecard =
            interview.scorecards.find(s => s.interviewer?.userId === profile.userId) ?? interview.scorecards[0];

        const coInterviewers = interview.scorecards
            .filter(s => s.interviewId !== scorecard.interviewId)
            .map(s => {
                return {
                    interviewId: s.interviewId,
                    key: s.interviewId,
                    interviewerName: s.interviewer?.name,
                    interviewStartDateTime: interview.interviewStartDateTime,
                    structure: s.structure,
                    status: s.status,
                    decision: scorecard.decision,
                };
            });

        return {
            interviewId: scorecard.interviewId,
            key: scorecard.interviewId,
            candidateName: interview.candidate,
            position: interview.position,
            interviewStartDateTimeDisplay: interview.interviewStartDateTime,
            interviewStartDateTime: interview.interviewStartDateTime,
            interviewerName: scorecard.interviewer?.name,
            interviewerId: scorecard.interviewer?.userId,
            status: scorecard.status,
            isDemo: interview.isDemo,
            structure: scorecard.structure,
            decision: scorecard.decision,
            children: coInterviewers.length > 0 ? coInterviewers : null,
        };
    });
};

export const selectUncompletedInterviews = state => {
    const interviews = selectInterviews(state);
    const uncompletedInterviews = interviews.filter(i => i.scorecards.some(s => s.status !== Status.SUBMITTED));
    const uncompletedInterviewsView = selectInterviewsTable(uncompletedInterviews, state.user.profile);

    return selectSortedByDateInterviews(uncompletedInterviewsView);
};

export const selectCompletedInterviews = state => {
    const interviews = selectInterviews(state);
    const completedInterviews = interviews.filter(i => i.scorecards.every(s => s.status === Status.SUBMITTED));
    const completedInterviewsView = selectInterviewsTable(completedInterviews, state.user.profile);

    return selectSortedByDateInterviews(completedInterviewsView, true);
};

export const selectCandidateInterviews = (state, candidateId) => {
    const interviews = selectInterviews(state);
    const candidateInterviews = interviews.filter(i => i.candidateId === candidateId);
    const candidateInterviewsView = selectInterviewsTable(candidateInterviews, state.user.profile);

    return selectSortedByDateInterviews(candidateInterviewsView);
};

export const selectSharedScorecard = (state, token) => {
    return state.interviews.sharedScorecards.find(scorecard => scorecard.token === token);
};
