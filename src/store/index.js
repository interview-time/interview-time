import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import templates from "./templates/reducer";
import interviews from "./interviews/reducer";
import user from "./user/reducer";
import candidates from "./candidates/reducer";
import teams from "./teams/reducer";

// remove 'middleware' when we fix all issues found by immutableStateInvariant https://redux-toolkit.js.org/api/getDefaultMiddleware
export default configureStore({
    middleware: [thunk],
    reducer: {
        user: user,
        interviews: interviews,
        templates: templates,
        candidates: candidates,
        teams: teams,
    },
});
