export const LOAD_TEMPLATES = "LOAD_TEMPLATES";
export const SET_TEMPLATES = "SET_TEMPLATES";
export const ADD_TEMPLATE = "ADD_TEMPLATE";
export const UPDATE_TEMPLATE = "UPDATE_TEMPLATE";
export const DELETE_TEMPLATE = "DELETE_TEMPLATE";

export const loadTemplates = (forceFetch = false) => ({
    type: LOAD_TEMPLATES,
    payload: {
        forceFetch
    }
});

export const setTemplates = (guides) => ({
    type: SET_TEMPLATES,
    payload: {
        guides
    }
});

export const addTemplate = (guide) => ({
    type: ADD_TEMPLATE,
    payload: {
        guide
    }
});

export const updateTemplate = (guide) => ({
    type: UPDATE_TEMPLATE,
    payload: {
        guide
    }
});

export const deleteTemplate = (guideId) => ({
    type: DELETE_TEMPLATE,
    payload: {
        guideId
    }
});