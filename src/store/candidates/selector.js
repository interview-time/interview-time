export const selectCandidate = (state, candidateId) => {
    const filteredCanddiate = state.candidates.filter(c => c.candidateId === candidateId);
    if (filteredCanddiate && filteredCanddiate.length > 0) {
        return filteredCanddiate[0];
    }

    return null;
};
