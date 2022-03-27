export const selectInterview = (state, interviewId) => {
    const filteredInterviews = state.interviews.filter(c => c.interviewId === interviewId);
    if (filteredInterviews && filteredInterviews.length > 0) {
        return filteredInterviews[0];
    }

    return null;
};
