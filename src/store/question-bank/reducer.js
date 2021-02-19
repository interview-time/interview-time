import {
    ADD_CATEGORY,
    ADD_QUESTION, ADD_QUESTIONS,
    DELETE_CATEGORY,
    DELETE_QUESTION,
    LOAD_QUESTION_BANK,
    loadQuestionBank,
    SET_QUESTION_BANK,
    setQuestionBank,
    UPDATE_CATEGORY,
    UPDATE_QUESTION
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";

const initialState = {
    questions: [],
    categories: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/question-bank`;

const questionBankReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOAD_QUESTION_BANK: {
            console.log(action.type)
            getAccessTokenSilently()
                .then(token => axios.get(URL, config(token)))
                .then(res => store.dispatch(setQuestionBank(res.data)))
                .catch(reason => console.error(reason));

            return { ...state, loading: true };
        }

        case SET_QUESTION_BANK: {
            console.log(action.type)
            const { questions, categories } = action.payload;

            return {
                ...state,
                questions: questions ? questions : [],
                categories: categories ? categories : [],
                loading: false
            };
        }

        case UPDATE_CATEGORY: {
            console.log(action.type)
            const { category, newCategory } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.post(`${URL}/category/${category}/${newCategory}`, null, config(token)))
                .then(() => console.log(`Questions with category ${category} updated to ${newCategory}`))
                .catch(reason => console.error(reason));

            const questions = state.questions.map(item => {
                if (item.category === category) {
                    item.category = newCategory
                }
                return item
            });

            const categories = state.categories.map(item => {
                if (item === category) {
                    return newCategory
                } else {
                    return item
                }
            });

            return {
                ...state,
                questions: questions,
                categories: categories
            };
        }

        case DELETE_CATEGORY: {
            console.log(action.type)
            const { category } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/category/${category}`, config(token)))
                .then(() => console.log(`Questions with category removed: ${category}`))
                .catch(reason => console.error(reason));

            const questions = state.questions.filter(question => question.category !== category);
            const categories = state.categories.filter(item => item !== category);

            return {
                ...state,
                questions: questions,
                categories: categories,
            };
        }

        case ADD_QUESTION: {
            console.log(action.type)
            const { question } = action.payload;
            question.questionId = Date.now().toString();

            getAccessTokenSilently()
                .then((token) => axios.post(URL, question, config(token)))
                .then(() => console.log(`Question added: ${JSON.stringify(question)}`))
                .then(() => store.dispatch(loadQuestionBank()))
                .catch(reason => console.error(reason));

            return {
                ...state,
                questions: [
                    ...state.questions, question
                ]
            };
        }

        case ADD_QUESTIONS: {
            console.log(action.type)
            const questionId = Date.now().toString()
            const { questions } = action.payload;
            questions.forEach((question, index) => question.questionId = questionId + index)

            getAccessTokenSilently()
                .then((token) => axios.post(`${URL}/questions`, questions, config(token)))
                .then(() => console.log(`Question added: ${JSON.stringify(questions)}`))
                .then(() => store.dispatch(loadQuestionBank()))
                .catch(reason => console.error(reason));

            return {
                ...state,
                questions: [
                    ...state.questions, questions
                ]
            };
        }

        case UPDATE_QUESTION: {
            console.log(action.type)
            const { question } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.put(URL, question, config(token)))
                .then(() => console.log(`Question updated: ${JSON.stringify(question)}`))
                .then(() => store.dispatch(loadQuestionBank()))
                .catch(reason => console.error(reason));

            const questions = state.questions.map(q => {
                if (q.questionId !== question.questionId) {
                    return q;
                }

                return {
                    ...q, ...question
                }
            });

            return {
                ...state,
                questions: questions
            };
        }

        case DELETE_QUESTION: {
            console.log(action.type)
            const { questionId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/${questionId}`, config(token)))
                .then(() => console.log(`Question removed: ${JSON.stringify(questionId)}`))
                .catch(reason => console.error(reason));

            const reducedQuestions = state.questions.filter(question => question.questionId !== questionId);

            return {
                ...state,
                questions: reducedQuestions
            };
        }

        case ADD_CATEGORY: {
            const { newCategory } = action.payload;

            return {
                ...state,
                categories: [
                    ...state.categories, newCategory
                ]
            };
        }

        default:
            return state;
    }
}

export default questionBankReducer;