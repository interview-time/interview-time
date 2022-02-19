export const LOAD_INTERVIEWS = "LOAD_INTERVIEWS";
export const SET_INTERVIEWS = "SET_INTERVIEWS";
export const SET_UPLOADING = "SET_UPLOADING";
export const ADD_INTERVIEW = "ADD_INTERVIEW";
export const UPDATE_INTERVIEW = "UPDATE_INTERVIEW";
export const DELETE_INTERVIEW = "DELETE_INTERVIEW";
export const UPDATE_SCORECARD = "UPDATE_SCORECARD";

export function loadInterviews(forceFetch = false) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: LOAD_INTERVIEWS,
            payload: {
                forceFetch: forceFetch,
                teamId: user.activeTeam.teamId,
            },
        });
    };
}

export const setInterviews = interviews => ({
    type: SET_INTERVIEWS,
    payload: {
        interviews,
    },
});

export const setUploading = uploading => ({
    type: SET_UPLOADING,
    payload: {
        uploading,
    },
});

export function addInterview(interview) {
    return (dispatch, getState) => {
        const { user } = getState();

        dispatch({
            type: ADD_INTERVIEW,
            payload: {
                interview: interview,
                teamId: user.activeTeam.teamId,
            },
        });
    };
}

export const updateScorecard = interview => ({
    type: UPDATE_SCORECARD,
    payload: {
        interview,
    },
});

export const updateInterview = interview => ({
    type: UPDATE_INTERVIEW,
    payload: {
        interview,
    },
});

export const deleteInterview = interviewId => ({
    type: DELETE_INTERVIEW,
    payload: {
        interviewId,
    },
});
