export const LOAD_CANDIDATES = "LOAD_CANDIDATES";
export const SET_CANDIDATES = "SET_CANDIDATES";
export const CREATE_CANDIDATE = "CREATE_CANDIDATE";
export const UPDATE_CANDIDATE = "UPDATE_CANDIDATE";
export const DELETE_CANDIDATE = "DELETE_CANDIDATE";
export const GET_UPLOAD_URL = "GET_UPLOAD_URL";
export const SET_UPLOAD_URL = "SET_UPLOAD_URL";

export function loadCandidates(forceFetch = false) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: LOAD_CANDIDATES,
            payload: {
                forceFetch: forceFetch,
                teamId: user.activeTeam.teamId,
            },
        });
    };
}

export const setCandidates = candidates => ({
    type: SET_CANDIDATES,
    payload: {
        candidates,
    },
});

export const setUploadUrl = uploadUrl => ({
    type: SET_UPLOAD_URL,
    payload: {
        uploadUrl,
    },
});

export function getUploadUrl(candidateId, filename) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: GET_UPLOAD_URL,
            payload: {
                candidateId: candidateId,
                filename: filename,
                teamId: user.activeTeam.teamId,
            },
        });
    };
}

export function createCandidate(candidate) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: CREATE_CANDIDATE,
            payload: {
                candidate: candidate,
                teamId: user.activeTeam.teamId,
            },
        });
    };
}

export function updateCandidate(candidate) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: UPDATE_CANDIDATE,
            payload: {
                candidate: candidate,
                teamId: user.activeTeam.teamId,
            },
        });
    };
}

export function deleteCandidate(candidateId) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: DELETE_CANDIDATE,
            payload: {
                candidateId: candidateId,
                teamId: user.activeTeam.teamId,
            },
        });
    };
}
