import { combineReducers, createStore } from "redux";
import questionBank from "./question-bank/reducer";
import guides from "./templates/reducer";
import interviews from "./interviews/reducer";

export const rootReducer = combineReducers({ questionBank, guides, interviews });

export default createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);