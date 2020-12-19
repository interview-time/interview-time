export const LOAD_GUIDES = "LOAD_GUIDES";
export const SET_GUIDES = "SET_GUIDES";
export const ADD_GUIDE = "ADD_GUIDE";
export const UPDATE_GUIDE = "UPDATE_GUIDE";
export const DELETE_GUIDE = "DELETE_GUIDE";

export const loadGuides = () => ({
    type: LOAD_GUIDES
});

export const setGuides = (guides) => ({
    type: SET_GUIDES,
    payload: {
        guides
    }
});

export const addGuide = (guide) => ({
    type: ADD_GUIDE,
    payload: {
        guide
    }
});

export const updateGuide = (guide) => ({
    type: UPDATE_GUIDE,
    payload: {
        guide
    }
});

export const deleteGuide = (guideId) => ({
    type: DELETE_GUIDE,
    payload: {
        guideId
    }
});