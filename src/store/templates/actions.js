export const LOAD_TEMPLATES = "LOAD_TEMPLATES";
export const LOAD_LIBRARY = "LOAD_LIBRARY";
export const SET_TEMPLATES = "SET_TEMPLATES";
export const SET_LIBRARY = "SET_LIBRARY";
export const ADD_TEMPLATE = "ADD_TEMPLATE";
export const UPDATE_TEMPLATE = "UPDATE_TEMPLATE";
export const DELETE_TEMPLATE = "DELETE_TEMPLATE";
export const SHARE_TEMPLATE = "SHARE_TEMPLATE";

export const loadTemplates = (forceFetch = false) => ({
    type: LOAD_TEMPLATES,
    payload: {
        forceFetch
    }
});

export const loadLibrary = (forceFetch = false) => ({
    type: LOAD_LIBRARY,
    payload: {
        forceFetch
    }
});

export const setTemplates = (templates) => ({
    type: SET_TEMPLATES,
    payload: {
        templates
    }
});

export const setLibrary = (library) => ({
    type: SET_LIBRARY,
    payload: {
        library
    }
});

export const addTemplate = (template) => ({
    type: ADD_TEMPLATE,
    payload: {
        template
    }
});

export const updateTemplate = (template) => ({
    type: UPDATE_TEMPLATE,
    payload: {
        template
    }
});

export const deleteTemplate = (templateId) => ({
    type: DELETE_TEMPLATE,
    payload: {
        templateId
    }
});

export const shareTemplate = (templateId, share) => ({
    type: SHARE_TEMPLATE,
    payload: {
        templateId,
        share
    }
});