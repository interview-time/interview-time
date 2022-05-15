export const selectCandidate = (state, candidateId) => {
    return state.candidates.candidates.find(c => c.candidateId === candidateId);
};
