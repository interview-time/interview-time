export const selectInterview = (state, interviewId) => {
    return state.interviews.find(i => i.interviewId === interviewId);
};
