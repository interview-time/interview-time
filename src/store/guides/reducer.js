import { ADD_GUIDE, DELETE_GUIDE, LOAD_GUIDES, SET_GUIDES, setGuides, UPDATE_GUIDE } from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";

const initialState = {
    guides: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/guide`;

const guidesReducer = (state = initialState, action) => {
    console.log(action.type)
    switch (action.type) {
        case LOAD_GUIDES: {
            if (state.guides.length === 0) {
                getAccessTokenSilently()
                    .then((token) =>
                        axios.get(URL, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    )
                    .then(res => {
                        store.dispatch(setGuides(res.data || []));
                        console.log("Guides loaded.")
                    })
                    .catch((reason) => console.error(reason));

                return { ...state, loading: true };
            }

            return state;
        }

        case SET_GUIDES: {
            const { guides } = action.payload;

            // helps to avoid dealing with null collections
            guides.forEach(guide => {
                guide.structure.groups.forEach(group => {
                    if (!group.questions) {
                        group.questions = []
                    }
                })
            })
            return {
                ...state,
                guides: guides,
                loading: false
            };
        }

        case ADD_GUIDE: {
            const { guide } = action.payload;
            const localId = Date.now().toString()
            guide.guideId = localId

            getAccessTokenSilently()
                .then((token) =>
                    axios.post(URL, guide, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
                .then(res => {
                    const guides = state.guides.filter(item => item.guideId !== localId);
                    store.dispatch(setGuides([...guides, res.data]))
                    console.log(`Guide added: ${JSON.stringify(guide)}`)
                })
                .catch((reason) => console.error(reason));

            return {
                ...state,
                guides: [...state.guides, guide]
            };
        }

        case UPDATE_GUIDE: {
            const { guide } = action.payload;

            getAccessTokenSilently()
                .then((token) =>
                    axios.put(URL, guide, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
                .then(() => console.log(`Guide updated: ${JSON.stringify(guide)}`))
                .catch((reason) => console.error(reason));

            const guides = state.guides.map(item => {
                if (item.guideId !== guide.guideId) {
                    return item;
                }

                return {
                    ...item, ...guide
                }
            });

            return {
                ...state,
                guides: guides
            };
        }

        case DELETE_GUIDE: {
            const { guideId } = action.payload;

            getAccessTokenSilently()
                .then((token) =>
                    axios.delete(`${URL}/${guideId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
                .then(() => console.log("Guide removed."))
                .catch((reason) => console.error(reason));

            const guides = state.guides.filter(item => item.guideId !== guideId);
            return {
                ...state,
                guides: guides
            };
        }

        default:
            return state;
    }
}

export default guidesReducer;