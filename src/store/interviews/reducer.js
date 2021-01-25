import {
    ADD_INTERVIEW,
    DELETE_INTERVIEW,
    LOAD_INTERVIEWS, loadInterviews,
    SET_INTERVIEWS,
    setInterviews,
    UPDATE_INTERVIEW,
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";

const initialState = {
    interviews: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/interview`;

const interviewsReducer = (state = initialState, action) => {

    switch (action.type) {

        case LOAD_INTERVIEWS: {
            console.log(action.type)
            getAccessTokenSilently()
                .then(token => axios.get(URL, config(token)))
                .then(res => store.dispatch(setInterviews(res.data || [])))
                .catch(reason => console.error(reason));

            return { ...state, loading: true };
        }

        case SET_INTERVIEWS: {
            console.log(action.type)
            const { interviews } = action.payload;
            return {
                ...state,
                interviews: interviews,
                loading: false
            };
        }

        case ADD_INTERVIEW: {
            console.log(action.type)
            const { interview } = action.payload;
            interview.interviewId = Date.now().toString()

            getAccessTokenSilently()
                .then(token => axios.post(URL, interview, config(token)))
                .then(() => console.log(`Interview added: ${JSON.stringify(interview)}`))
                .then(() => store.dispatch(loadInterviews()))
                .catch(reason => console.error(reason));

            return {
                ...state,
                interviews: [...state.interviews, interview]
            };
        }

        case UPDATE_INTERVIEW: {
            console.log(action.type)
            const { interview } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.put(URL, interview, config(token)))
                .then(() => console.log(`Interview updated: ${JSON.stringify(interview)}`))
                .then(() => store.dispatch(loadInterviews()))
                .catch(reason => console.error(reason));

            const interviews = state.interviews.map(item => {
                if (item.interviewId !== interview.interviewId) {
                    return item;
                }

                return {
                    ...item, ...interview
                }
            });

            return {
                ...state,
                interviews: interviews
            };
        }

        case DELETE_INTERVIEW: {
            console.log(action.type)
            const { interviewId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/${interviewId}`, config(token)))
                .then(() => console.log("Interview removed."))
                .catch(reason => console.error(reason));

            const interviews = state.interviews.filter(item => item.interviewId !== interviewId);
            return {
                ...state,
                interviews: interviews
            };
        }

        default:
            return state;
    }
}

export default interviewsReducer;