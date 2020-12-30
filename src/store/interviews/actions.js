export const LOAD_INTERVIEWS = "LOAD_INTERVIEWS";
export const SET_INTERVIEWS = "SET_INTERVIEWS";
export const ADD_INTERVIEW = "ADD_INTERVIEW";
export const UPDATE_INTERVIEW = "UPDATE_INTERVIEW";
export const DELETE_INTERVIEW = "DELETE_INTERVIEW";

export const loadInterviews = () => ({
    type: LOAD_INTERVIEWS
});

export const setInterviews = (interviews) => ({
    type: SET_INTERVIEWS,
    payload: {
        interviews
    }
});

export const addInterview = (interview) => ({
    type: ADD_INTERVIEW,
    payload: {
        interview
    }
});

export const updateInterview = (interview) => ({
    type: UPDATE_INTERVIEW,
    payload: {
        interview
    }
});

export const deleteInterview = (interviewId) => ({
    type: DELETE_INTERVIEW,
    payload: {
        interviewId
    }
});