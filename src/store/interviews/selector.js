export const selectInterview = (state, interviewId) => {
    return state.interviews.find(i => i.interviewId === interviewId);
};

export const selectInterviews = state => {
    const interviewsList = [];

    const result = state.interviews.reduce((prev, scorecard) => {
        interviewsList.push({
            candidate: state.candidates.find(c => c.candidateId === scorecard.candidateId)?.candidateName,
            candidateId: scorecard.candidateId,
            interviewStartDateTime: scorecard.interviewDateTime,
            interviewEndDateTime: scorecard.interviewEndDateTime,
            interviewers: state.user.teamMembers.filter(user => scorecard.interviewers.includes(user.userId)),
            isDemo: scorecard.isDemo,
            linkId: scorecard.linkId,
            position: scorecard.position,
            scorecards: [{
                id: scorecard.interviewId,
                status: scorecard.status,
                structure: scorecard.structure,
                notes: scorecard.notes,
                
            }]
        })
    }, []);

    console.log(result);
};

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
