export const selectCandidate = (state, candidateId) => {
    return state.candidates.find(c => c.candidateId === candidateId);
};
