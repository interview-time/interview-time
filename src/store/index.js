import { combineReducers, createStore } from "redux";
import questionBank from "./question-bank/reducer";
import templates from "./templates/reducer";
import interviews from "./interviews/reducer";
import communityQuestions from "./community-questions/reducer";

export const rootReducer = combineReducers({ questionBank, templates, interviews, communityQuestions });

export default createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);