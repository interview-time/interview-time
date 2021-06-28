import {
    ADD_INTERVIEW, ADD_INTERVIEW_WITH_TEMPLATE,
    DELETE_INTERVIEW,
    LOAD_INTERVIEWS,
    loadInterviews,
    SET_INTERVIEWS,
    SET_UPLOADING,
    setInterviews,
    setUploading,
    UPDATE_INTERVIEW,
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";
import { loadTemplates } from "../templates/actions";

const initialState = {
    interviews: [],
    loading: false,
    uploading: false
};

const URL = `${process.env.REACT_APP_API_URL}/interview`;

const interviewsReducer = (state = initialState, action) => {

    switch (action.type) {

        case LOAD_INTERVIEWS: {
            console.log(action.type)
            const { forceFetch } = action.payload

            if (forceFetch || (state.interviews.length === 0 && !state.loading)) {
                getAccessTokenSilently()
                    .then(token => axios.get(URL, config(token)))
                    .then(res => store.dispatch(setInterviews(res.data || [])))
                    .catch(reason => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
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

        case SET_UPLOADING: {
            console.log(action.type)
            const { uploading } = action.payload;
            return {
                ...state,
                uploading: uploading
            };
        }

        case ADD_INTERVIEW: {
            console.log(action.type)
            const { interview } = action.payload;
            interview.interviewId = Date.now().toString()

            getAccessTokenSilently()
                .then(token => axios.post(URL, interview, config(token)))
                .then(() => console.log(`Interview added: ${JSON.stringify(interview)}`))
                .then(() => store.dispatch(loadInterviews(true)))
                .catch(reason => console.error(reason));

            return {
                ...state,
                interviews: [...state.interviews, interview]
            };
        }

        case ADD_INTERVIEW_WITH_TEMPLATE: {
            console.log(action.type)
            const template = action.payload.template;
            const interview = action.payload.interview;

            template.templateId = Date.now().toString();
            interview.interviewId = Date.now().toString()

            const templateURL = `${process.env.REACT_APP_API_URL}/template`;

            getAccessTokenSilently()
                .then(token => {
                    let tokenPromise = Promise.resolve(token)
                    let templatePromise = axios.post(templateURL, template, config(token))
                    return Promise.all([tokenPromise, templatePromise])
                })
                .then(res => {
                    let token = res[0]
                    let template = res[1].data
                    interview.templateId = template.templateId
                    return axios.post(URL, interview, config(token))
                })
                .then(() => console.log(`Interview added: ${JSON.stringify(interview)}`))
                .then(() => store.dispatch(loadInterviews(true)))
                .then(() => store.dispatch(loadTemplates(true)))
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
                .then(() => {
                    store.dispatch(setUploading(false))
                    store.dispatch(loadInterviews(true))
                })
                .catch(reason => {
                    store.dispatch(setUploading(false))
                    console.error(reason)
                });

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
                interviews: interviews,
                uploading: true
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