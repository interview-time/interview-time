import {
    ADD_INTERVIEW,
    DELETE_INTERVIEW,
    LOAD_INTERVIEWS,
    loadInterviews,
    SET_INTERVIEWS,
    SET_UPLOADING,
    setInterviews,
    setUploading,
    UPDATE_INTERVIEW,
    UPDATE_SCORECARD
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";
import { log } from "../../components/utils/log";
import { formatDateISO } from "../../components/utils/date-fns";

/**
 *
 * @type {{uploading: boolean, loading: boolean, interviews: Interview[]}}
 */
const initialState = {
    interviews: [],
    loading: false,
    uploading: false,
};

const URL = `${process.env.REACT_APP_API_URL}/interview`;

const interviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_INTERVIEWS: {
            const { forceFetch, teamId } = action.payload;

            if (forceFetch || (state.interviews.length === 0 && !state.loading)) {
                getAccessTokenSilently()
                    .then(token => axios.get(`${URL}/${teamId}`, config(token)))
                    .then(res => store.dispatch(setInterviews(res.data || [])))
                    .catch(reason => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case SET_INTERVIEWS: {
            const { interviews } = action.payload;

            // backward compatibility
            interviews.forEach(interview => {
                if (!interview.templateIds || interview.templateIds.length === 0) {
                    if (interview.templateId) {
                        interview.templateIds = [interview.templateId];
                    } else {
                        interview.templateIds = [];
                    }
                }
            });

            return {
                ...state,
                interviews: interviews,
                loading: false,
            };
        }

        case SET_UPLOADING: {
            const { uploading } = action.payload;
            return {
                ...state,
                uploading: uploading,
            };
        }

        case ADD_INTERVIEW: {
            const { interview, teamId } = action.payload;
            interview.interviewId = Date.now().toString();
            interview.teamId = teamId;

            getAccessTokenSilently()
                .then(token => axios.post(URL, interview, config(token)))
                .then(() => log(`Interview added: ${JSON.stringify(interview)}`))
                .then(() => store.dispatch(loadInterviews(true)))
                .catch(reason => console.error(reason));

            return {
                ...state,
                interviews: [...state.interviews, interview],
            };
        }

        case UPDATE_SCORECARD: {
            const { interview } = action.payload;

            interview.modifiedDate = formatDateISO(new Date());

            getAccessTokenSilently()
                .then(token => axios.put(URL, interview, config(token)))
                .then(() => log(`SCORECARD updated: ${JSON.stringify(interview)}`))
                .then(() => {
                    store.dispatch(setUploading(false));
                })
                .catch(reason => {
                    store.dispatch(setUploading(false));
                    console.error(reason);
                });

            const interviews = state.interviews.map(item => {
                if (item.interviewId !== interview.interviewId) {
                    return item;
                }

                return {
                    ...item,
                    ...interview,
                };
            });

            return {
                ...state,
                interviews: interviews,
                uploading: true,
            };
        }

        case UPDATE_INTERVIEW: {
            const { interview } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.put(URL, interview, config(token)))
                .then(() => log(`Interview updated: ${JSON.stringify(interview)}`))
                .then(() => {
                    store.dispatch(setUploading(false));
                    store.dispatch(loadInterviews(true));
                })
                .catch(reason => {
                    store.dispatch(setUploading(false));
                    console.error(reason);
                });

            const interviews = state.interviews.map(item => {
                if (item.interviewId !== interview.interviewId) {
                    return item;
                }

                return {
                    ...item,
                    ...interview,
                };
            });

            return {
                ...state,
                interviews: interviews,
                uploading: true,
            };
        }

        case DELETE_INTERVIEW: {
            const { interviewId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/${interviewId}`, config(token)))
                .then(() => log("Interview removed."))
                .catch(reason => console.error(reason));

            const interviews = state.interviews.filter(item => item.interviewId !== interviewId);
            return {
                ...state,
                interviews: interviews,
            };
        }

        default:
            return state;
    }
};

export default interviewsReducer;
