import { ADD_GUIDE, DELETE_GUIDE, LOAD_GUIDES, loadGuides, SET_GUIDES, setGuides, UPDATE_GUIDE } from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";

const initialState = {
    guides: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/guide`;

const guidesReducer = (state = initialState, action) => {

    switch (action.type) {

        case LOAD_GUIDES: {
            console.log(action.type)
            getAccessTokenSilently()
                .then(token => axios.get(URL, config(token)))
                .then(res => store.dispatch(setGuides(res.data || [])))
                .catch(reason => console.error(reason));

            return { ...state, loading: true };
        }

        case SET_GUIDES: {
            console.log(action.type)
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
            console.log(action.type)
            const { guide } = action.payload;
            guide.guideId = Date.now().toString()

            getAccessTokenSilently()
                .then(token => axios.post(URL, guide, config(token)))
                .then(() => console.log(`Guide added: ${JSON.stringify(guide)}`))
                .then(() => store.dispatch(loadGuides()))
                .catch(reason => console.error(reason));

            return {
                ...state,
                guides: [...state.guides, guide]
            };
        }

        case UPDATE_GUIDE: {
            console.log(action.type)
            const { guide } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.put(URL, guide, config(token)))
                .then(() => console.log(`Guide updated: ${JSON.stringify(guide)}`))
                .then(() => store.dispatch(loadGuides()))
                .catch(reason => console.error(reason));

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
            console.log(action.type)
            const { guideId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/${guideId}`, config(token)))
                .then(() => console.log("Guide removed."))
                .catch(reason => console.error(reason));

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