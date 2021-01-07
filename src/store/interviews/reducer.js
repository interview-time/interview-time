import {
    LOAD_INTERVIEWS,
    SET_INTERVIEWS,
    ADD_INTERVIEW,
    UPDATE_INTERVIEW,
    DELETE_INTERVIEW
} from "./actions";
import axios from "axios";
import store from "../../store";
import { setInterviews } from "./actions";

const initialState = {
    interviews: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/interview`;

export default function (state = initialState, action) {
    console.log(action.type)
    switch (action.type) {
        case LOAD_INTERVIEWS: {
            if (state.interviews.length === 0) {

                getAccessTokenSilently().then((token) => {
                    axios
                        .get(URL, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then(res => {
                            store.dispatch(setInterviews(res.data || []));
                            console.log("Interviews loaded.")
                        })
                        .catch((reason) => console.error(reason));
                });

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
            interview.guideId = "653529ed-d588-4c03-9fea-1dfac630ad38"
            const localId = Date.now().toString()
            interview.interviewId = Date.now().toString()
            console.log(JSON.stringify(interview))

            getAccessTokenSilently().then((token) => {
                axios
                    .post(URL, interview, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(res => {
                        const interviews = state.interviews.filter(item => item.interviewId !== localId);
                        store.dispatch(setInterviews([...interviews, res.data]))
                        console.log("Interview added.")
                    })
                    .catch((reason) => console.error(reason));
            });

            return {
                ...state,
                interviews: [...state.interviews, interview]
            };
        }

        case UPDATE_INTERVIEW: {
            const { interview } = action.payload;

            getAccessTokenSilently().then((token) => {
                axios
                    .put(URL, interview, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(() => console.log("Interview updated."))
                    .catch((reason) => console.error(reason));
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
                interviews: interviews
            };
        }

        case DELETE_INTERVIEW: {
            const { interviewId } = action.payload;

            getAccessTokenSilently().then((token) => {
                axios
                    .delete(`${URL}/${interviewId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(() => console.log("Interview removed."))
                    .catch((reason) => console.error(reason));
            });

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
