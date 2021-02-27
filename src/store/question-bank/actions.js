export const LOAD_QUESTION_BANK = "LOAD_QUESTION_BANK";
export const SET_QUESTION_BANK = "SET_QUESTION_BANK";
export const DELETE_CATEGORY = "DELETE_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const ADD_QUESTION = "ADD_QUESTION";
export const ADD_QUESTIONS = "ADD_QUESTIONS";
export const UPDATE_QUESTION = "UPDATE_QUESTION";
export const DELETE_QUESTION = "DELETE_QUESTION";
export const ADD_CATEGORY = "ADD_CATEGORY";

export const loadQuestionBank = (forceFetch = false) => ({
    type: LOAD_QUESTION_BANK,
    payload: {
        forceFetch
    }
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

export const addQuestions = (questions) => ({
    type: ADD_QUESTIONS,
    payload: {
        questions
    }
});

export const updateQuestion = (question) => ({
    type: UPDATE_QUESTION,
    payload: {
        question
    }
});

export const deleteQuestion = (questionId) => ({
    type: DELETE_QUESTION,
    payload: {
        questionId
    }
});

export const addCategory = (newCategory) => ({
    type: ADD_CATEGORY,
    payload: {
        newCategory
    }
});

export const deleteCategory = (category) => ({
    type: DELETE_CATEGORY,
    payload: {
        category
    }
});

export const updateCategory = (category, newCategory) => ({
    type: UPDATE_CATEGORY,
    payload: {
        category,
        newCategory
    }
});