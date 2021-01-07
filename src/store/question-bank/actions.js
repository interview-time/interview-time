export const LOAD_QUESTION_BANK = "LOAD_QUESTION_BANK";
export const SET_QUESTION_BANK = "SET_QUESTION_BANK";
export const ADD_QUESTION = "ADD_QUESTION";
export const UPDATE_QUESTION = "UPDATE_QUESTION";
export const DELETE_QUESTION = "DELETE_QUESTION";
export const ADD_CATEGORY = "ADD_CATEGORY";

export const loadQuestionBank = () => ({
    type: LOAD_QUESTION_BANK
});

export const setQuestionBank = (questionBank) => ({
    type: SET_QUESTION_BANK,
    payload: questionBank
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

export const addCategory = (newCategory) => ({
    type: ADD_CATEGORY,
    payload: {
        newCategory
    }
});