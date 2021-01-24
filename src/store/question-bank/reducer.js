import {
    ADD_CATEGORY,
    ADD_QUESTION,
    DELETE_CATEGORY,
    DELETE_QUESTION,
    LOAD_QUESTION_BANK,
    SET_QUESTION_BANK,
    setQuestionBank,
    UPDATE_CATEGORY,
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
                questions: questions ? questions : [],
                categories: categories ? categories : [],
                loading: false
            };
        }

        case UPDATE_CATEGORY: {
            const { category, newCategory } = action.payload;

            getAccessTokenSilently()
                .then((token) =>
                    axios.post(`${URL}/category/${category}/${newCategory}`, null,{
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    )
                )
                .then(() => console.log(`Questions with category ${category} updated to ${newCategory}`))
                .catch((reason) => console.error(reason));

            const questions = state.questions.map(item => {
                if(item.category === category) {
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
            const { category } = action.payload;

            getAccessTokenSilently()
                .then((token) =>
                    axios.delete(`${URL}/category/${category}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    )
                )
                .then(() => console.log(`Questions with category removed: ${category}`))
                .catch((reason) => console.error(reason));

            const questions = state.questions.filter(question => question.category !== category);
            const categories = state.categories.filter(item => item !== category);

            return {
                ...state,
                questions: questions,
                categories: categories,
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