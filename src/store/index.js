import { combineReducers, createStore } from "redux";
import questionBank from "./question-bank/reducer";

export const rootReducer = combineReducers({ questionBank });

export default createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);