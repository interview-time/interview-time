export const LOAD_INTERVIEWS = "LOAD_INTERVIEWS";
export const SET_INTERVIEWS = "SET_INTERVIEWS";
export const SET_UPLOADING = "SET_UPLOADING";
export const ADD_INTERVIEW = "ADD_INTERVIEW";
export const ADD_INTERVIEW_WITH_TEMPLATE = "ADD_INTERVIEW_WITH_TEMPLATE";
export const UPDATE_INTERVIEW = "UPDATE_INTERVIEW";
export const DELETE_INTERVIEW = "DELETE_INTERVIEW";
export const UPDATE_SCORECARD = "UPDATE_SCORECARD";

export const loadInterviews = (forceFetch = false) => ({
    type: LOAD_INTERVIEWS,
    payload: {
        forceFetch,
    }
});

export const setInterviews = (interviews) => ({
    type: SET_INTERVIEWS,
    payload: {
        interviews,
    }
});

export const setUploading = (uploading) => ({
    type: SET_UPLOADING,
    payload: {
        uploading,
    }
});


export const addInterview = (interview) => ({
    type: ADD_INTERVIEW,
    payload: {
        interview
    }
});

export const addInterviewWithTemplate = (interview, template) => ({
    type: ADD_INTERVIEW_WITH_TEMPLATE,
    payload: {
        interview: interview,
        template: template
    }
});

export const updateScorecard = (interview) => ({
    type: UPDATE_SCORECARD,
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