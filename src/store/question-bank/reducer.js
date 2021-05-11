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
import { cloneDeep } from "lodash/lang";
import { orderBy } from "lodash/collection";
import { findCategory } from "../../components/utils/converters";
import { findIndex} from "lodash/array";

/**
 *
 * @type {{categories: CategoryHolder[], loading: boolean}}
 */
const initialState = {
    categories: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/question-bank`;

const questionBankReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOAD_QUESTION_BANK: {
            console.log(action.type)
            const { forceFetch } = action.payload;

            if(forceFetch || (state.categories.length === 0 && !state.loading)) {
                getAccessTokenSilently()
                    .then(token => axios.get(`${URL}/new`, config(token)))
                    .then(res => store.dispatch(setQuestionBank(res.data)))
                    .catch(reason => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case SET_QUESTION_BANK: {
            console.log(action.type)

            const categories = action.payload.filter(c => c.category.isActive)
            categories.forEach(c =>
                c.questions = orderBy(c.questions, ['createdDate'], ['asc'])
            )

            return {
                ...state,
                categories: categories,
                loading: false
            };
        }

        case UPDATE_CATEGORY: {
            console.log(action.type)
            const { category } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.put(`${URL}/category`, category, config(token)))
                .then(() => console.log(`Category updated to ${category.categoryName}`))
                .then(() => store.dispatch(loadQuestionBank(true)))
                .catch(reason => console.error(reason));

            const categories = cloneDeep(state.categories)
            const index = findIndex(categories, c => c.category.categoryId === category.categoryId)
            categories[index].category = category

            return {
                ...state,
                categories: categories
            };
        }

        case DELETE_CATEGORY: {
            console.log(action.type)
            const { category } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/category/${category.categoryId}`, config(token)))
                .then(() => console.log(`Questions with category removed: ${category.categoryId}`))
                .catch(reason => console.error(reason));

            return {
                ...state,
                categories: state.categories.filter(c => c.category.categoryId !== category.categoryId)
            };
        }

        case ADD_QUESTION: {
            console.log(action.type)
            const { question } = action.payload;
            question.questionId = Date.now().toString();

            getAccessTokenSilently()
                .then((token) => axios.post(URL, question, config(token)))
                .then(() => console.log(`Question added: ${JSON.stringify(question)}`))
                .then(() => store.dispatch(loadQuestionBank(true)))
                .catch(reason => console.error(reason));

            const categories = cloneDeep(state.categories)
            findCategory(question.categoryId, categories).questions
                .push(question)

            return {
                ...state,
                categories: categories
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
                .then(() => store.dispatch(loadQuestionBank(true)))
                .catch(reason => console.error(reason));

            const categories = cloneDeep(state.categories)
            const category = findCategory(questions[0].categoryId, categories)
            category.questions.push(questions)

            return {
                ...state,
                categories: categories
            };
        }

        case UPDATE_QUESTION: {
            console.log(action.type)
            const { question } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.put(URL, question, config(token)))
                .then(() => console.log(`Question updated: ${JSON.stringify(question)}`))
                .then(() => store.dispatch(loadQuestionBank(true)))
                .catch(reason => console.error(reason));

            const categories = cloneDeep(state.categories)
            const category = findCategory(question.categoryId, categories)
            const index = findIndex(category.questions, q => q.questionId === question.questionId)
            category.questions[index] = question

            return {
                ...state,
                categories: categories
            };
        }

        case DELETE_QUESTION: {
            console.log(action.type)
            const { questionId, categoryId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/${questionId}`, config(token)))
                .then(() => console.log(`Question removed: ${JSON.stringify(questionId)}`))
                .catch(reason => console.error(reason));

            const categories = cloneDeep(state.categories)
            const category = findCategory(categoryId, categories)
            category.questions = category.questions.filter(q => q.questionId !== questionId)

            return {
                ...state,
                categories: categories
            };
        }

        case ADD_CATEGORY: {
            console.log(action.type)
            const { category } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.post(`${URL}/category`, {categoryName: category.categoryName}, config(token)))
                .then(() => console.log(`Category created ${category.categoryName}`))
                .then(() => store.dispatch(loadQuestionBank(true)))
                .catch(reason => console.error(reason));

            return { ...state, loading: true };
        }

        default:
            return state;
    }
}

export default questionBankReducer;