import {
    ADD_CATEGORY,
    ADD_QUESTION,
    DELETE_QUESTION,
    LOAD_QUESTION_BANK,
    SET_QUESTION_BANK,
    setQuestionBank,
    UPDATE_QUESTION
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";

const initialState = {
    questions: [],
    categories: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/question-bank`;

const questionBankReducer = (state = initialState, action) => {
    console.log(action.type)
    switch (action.type) {

        case LOAD_QUESTION_BANK: {

            if (state.questions.length === 0) {
                getAccessTokenSilently()
                    .then((token) =>
                        axios.get(URL, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    )
                    .then(res => store.dispatch(setQuestionBank(res.data)))
                    .catch((reason) => console.error(reason));

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
            const localId = Date.now().toString()
            question.questionId = localId

            getAccessTokenSilently()
                .then((token) =>
                    axios.post(URL, question, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
                .then(res => {
                    const question = state.questions.filter(item => item.questionId !== localId);
                    store.dispatch(setQuestionBank(
                        {
                            ...state,
                            questions: [...state.questions, res.data]
                        }
                    ))
                    console.log(`Question added: ${JSON.stringify(question)}`)
                })
                .catch((reason) => console.error(reason));

            return {
                ...state,
                questions: [
                    ...state.questions, question
                ]
            };
        }

        case UPDATE_QUESTION: {
            const { question } = action.payload;

            getAccessTokenSilently()
                .then((token) =>
                    axios.put(URL, question, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
                .then(() => console.log(`Question updated: ${JSON.stringify(question)}`))
                .catch((reason) => console.error(reason));

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
            const { questionId } = action.payload;

            getAccessTokenSilently()
                .then((token) =>
                    axios.delete(`${URL}/${questionId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    )
                )
                .then(() => console.log(`Question removed: ${JSON.stringify(questionId)}`))
                .catch((reason) => console.error(reason));

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