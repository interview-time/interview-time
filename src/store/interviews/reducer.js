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
    UPDATE_SCORECARD,
    SHARE_SCORECARD,
    UNSHARE_SCORECARD,
    SET_SHARED_SCORECARD,
    REQUEST_STARTED,
    REQUEST_FINISHED,
    GENERATING_LINK_STARTED,
    GENERATING_LINK_FINISHED
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
    sharedScorecards: [],
    generatingLink: false,
};

const URL = `${process.env.REACT_APP_API_URL}/interview`;

const interviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_STARTED: {
            return { ...state, loading: true };
        }

        case REQUEST_FINISHED: {
            return { ...state, loading: false };
        }

        case GENERATING_LINK_STARTED: {
            return { ...state, generatingLink: true };
        }

        case GENERATING_LINK_FINISHED: {
            return { ...state, generatingLink: false };
        }

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

        case SHARE_SCORECARD: {
            const { interviewId, token } = action.payload;

            return {
                ...state,
                interviews: state.interviews.map(interview => {
                    if (interview.interviewId === interviewId) {
                        return { ...interview, isShared: true, token: token };
                    } else {
                        return interview;
                    }
                }),
            };
        }

        case UNSHARE_SCORECARD: {
            const { interviewId } = action.payload;

            return {
                ...state,
                interviews: state.interviews.map(interview => {
                    if (interview.interviewId === interviewId) {
                        return { ...interview, isShared: false };
                    } else {
                        return interview;
                    }
                }),
            };
        }

        case SET_SHARED_SCORECARD: {
            const { token, scorecard } = action.payload;

            return {
                ...state,
                sharedScorecards: [
                    ...state.sharedScorecards.filter(scorecard => scorecard.token !== token),
                    { ...scorecard, token: token },
                ],
            };
        }

        default:
            return state;
    }
};

export default interviewsReducer;
