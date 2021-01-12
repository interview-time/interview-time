import {
    LOAD_INTERVIEWS,
    SET_INTERVIEWS,
    ADD_INTERVIEW,
    UPDATE_INTERVIEW,
    DELETE_INTERVIEW,
} from "./actions";
import axios from "axios";
import store from "../../store";
import { setInterviews } from "./actions";
import { getAccessTokenSilently } from "../../react-auth0-spa";

const initialState = {
    interviews: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/interview`;

const interviewsReducer = (state = initialState, action) => {
    console.log(action.type)
    switch (action.type) {
        case LOAD_INTERVIEWS: {
            if (state.interviews.length === 0) {

                getAccessTokenSilently()
                    .then((token) =>
                        axios.get(URL, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    )
                    .then(res => {
                        store.dispatch(setInterviews(res.data || []));
                        console.log("Interviews loaded.")
                    })
                    .catch((reason) => console.error(reason));

                return { ...state, loading: true };
            }

            return state;
        }

        case SET_INTERVIEWS: {
            const { interviews } = action.payload;
            return {
                ...state,
                interviews: interviews,
                loading: false
            };
        }

        case ADD_INTERVIEW: {
            const { interview } = action.payload;
            const localId = Date.now().toString()
            interview.interviewId = Date.now().toString()

            getAccessTokenSilently()
                .then((token) =>
                    axios.post(URL, interview, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
                .then(res => {
                    const interviews = state.interviews.filter(item => item.interviewId !== localId);
                    store.dispatch(setInterviews([...interviews, res.data]))
                    console.log(`Interview added: ${JSON.stringify(interview)}`)
                })
                .catch((reason) => console.error(reason));

            return {
                ...state,
                interviews: [...state.interviews, interview]
            };
        }

        case UPDATE_INTERVIEW: {
            const { interview } = action.payload;

            getAccessTokenSilently()
                .then((token) =>
                    axios.put(URL, interview, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
                .then(() => console.log(`Interview updated: ${JSON.stringify(interview)}`))
                .catch((reason) => console.error(reason));

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
            const { interviewId } = action.payload;

            getAccessTokenSilently()
                .then((token) =>
                    axios.delete(`${URL}/${interviewId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
                .then(() => console.log("Interview removed."))
                .catch((reason) => console.error(reason));

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