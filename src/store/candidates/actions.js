export const LOAD_CANDIDATES = "LOAD_CANDIDATES";
export const SET_CANDIDATES = "SET_CANDIDATES";
export const CREATE_CANDIDATE = "CREATE_CANDIDATE";
export const UPDATE_CANDIDATE = "UPDATE_CANDIDATE";
export const DELETE_CANDIDATE = "DELETE_CANDIDATE";

export const loadCandidates = (forceFetch = false) => ({
    type: LOAD_CANDIDATES,
    payload: {
        forceFetch
    }
});

export const setCandidates = (candidates) => ({
    type: SET_CANDIDATES,
    payload: {
        candidates
    }
});

export const createCandidate = (candidate) => ({
    type: CREATE_CANDIDATE,
    payload: {
        candidate
    }
});

export const updateCandidate = (candidate) => ({
    type: UPDATE_CANDIDATE,
    payload: {
        candidate
    }
});

export const deleteCandidate = (candidateId) => ({
    type: DELETE_CANDIDATE,
    payload: {
        candidateId
    }
});