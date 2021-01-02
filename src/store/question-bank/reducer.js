import {
    LOAD_QUESTION_BANK,
    SET_QUESTION_BANK,
    ADD_QUESTION,
    UPDATE_QUESTION,
    DELETE_QUESTION
} from "./actions";
import axios from "axios";
import store from "../../store";
import { setQuestionBank } from "./actions";

const initialState = {
    questions: [],
    categories: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {

        case LOAD_QUESTION_BANK: {

            if (state.questions.length === 0) {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/question-bank`, null)
                    .then(res => {                        
                        store.dispatch(setQuestionBank(res.data));
                    })
                    .catch(() => { });

                return { ...state, loading: true };
            }

            return state;
        }

        case SET_QUESTION_BANK: {
            const { questions, categories } = action.payload;

            return {
                ...state,
                questions: questions,
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
                questions: [
                    ...state.questions, question
                ]
            };
        }

        case UPDATE_QUESTION: {
            const { question } = action.payload;

            axios
                .put(`${process.env.REACT_APP_API_URL}/question-bank`, question, null)
                .then(res => { })
                .catch(() => { });

            var questions = state.questions.map(q => {
                if (q.id !== question.id) {
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
