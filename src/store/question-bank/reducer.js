import {
    LOAD_QUESTIONS,
    LOAD_CATEGORIES,
    SET_QUESTIONS,
    SET_CATEGORIES,
    ADD_QUESTION,
    UPDATE_QUESTION,
    DELETE_QUESTION
} from "./actions";
import axios from "axios";
import store from "../../store";
import { setQuestions, setCategories } from "./actions";

const initialState = {
    questionBank: [],
    categories: [],
    loading: false
};


export default function (state = initialState, action) {
    switch (action.type) {

        case LOAD_QUESTIONS: {
            const { category } = action.payload;

            const existingQuestions = state.questionBank.filter(question => question.category === category);
            if (existingQuestions.length === 0) {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/question-bank/${category}`, null)
                    .then(res => {
                        store.dispatch(setQuestions(res.data || []));
                    })
                    .catch(() => { });

                return { ...state, loading: true };
            }

            return state;
        }

        case LOAD_CATEGORIES: {

            if (state.categories.length === 0) {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/question-bank/categories`, null)
                    .then(res => {
                        store.dispatch(setCategories(res.data || []));
                    })
                    .catch(() => { });

                return { ...state, loading: true };
            }

            return state;
        }

        case SET_QUESTIONS: {
            const { questions } = action.payload;

            return {
                ...state,
                questions: questions,
                loading: false
            };
        }

        case SET_CATEGORIES: {
            const { categories } = action.payload;

            return {
                ...state,
                categories: categories,
                loading: false
            };
        }

        case ADD_QUESTION: {
            const { question } = action.payload;

            axios
                .post(`${process.env.REACT_APP_API_URL}/question-bank`, question, null)
                .then(res => { })
                .catch(() => { });

            return {
                ...state,
                questions: [...state.questions, question]
            };
        }

        case UPDATE_QUESTION: {
            const { question } = action.payload;

            axios
                .put(`${process.env.REACT_APP_API_URL}/question-bank`, question, null)
                .then(res => { })
                .catch(() => { });

            var questionToUpdate = state.questions.filter(q => q.id === question.id);
            if (questionToUpdate.length > 1) {
                questionToUpdate[0] = question;
            }

            return state;
        }

        case DELETE_QUESTION: {
            const { questionId } = action.payload;

            axios
                .delete(
                    `${process.env.REACT_APP_API_URL}/question-bank`,
                    {
                        data: {
                            questionId: questionId
                        }
                    }
                )
                .then(res => { })
                .catch(() => { });

            var questions = state.questions.filter(question => question.id !== questionId);

            return {
                ...state,
                questions: questions
            };
        }

        default:
            return state;
    }
}
