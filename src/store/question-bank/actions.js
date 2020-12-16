export const LOAD_QUESTIONS = "LOAD_QUESTIONS";
export const LOAD_CATEGORIES = "LOAD_CATEGORIES";
export const SET_QUESTIONS = "SET_QUESTIONS";
export const SET_CATEGORIES = "SET_CATEGORIES";
export const ADD_QUESTION = "ADD_QUESTION";
export const UPDATE_QUESTION = "UPDATE_QUESTION";
export const DELETE_QUESTION = "DELETE_QUESTION";

export const loadQuestions = (category) => ({
    type: LOAD_QUESTIONS,
    payload: {
        category
    }
});

export const loadCategories = () => ({
    type: LOAD_CATEGORIES
});

export const setQuestions = (questions) => ({
    type: SET_QUESTIONS,
    payload: {
        questions
    }
});

export const setCategories = (categories) => ({
    type: SET_CATEGORIES,
    payload: {
        categories
    }
});

export const addQuestion = (question) => ({
    type: ADD_QUESTION,
    payload: {
        question
    }
});

export const updateQuestion = (question) => ({
    type: UPDATE_QUESTION,
    payload: {
        question
    }
});

export const deleteQuestion = (question) => ({
    type: DELETE_QUESTION,
    payload: {
        question
    }
});