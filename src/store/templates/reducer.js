import {
    ADD_TEMPLATE,
    DELETE_TEMPLATE,
    LOAD_TEMPLATES,
    loadTemplates,
    SET_TEMPLATES,
    setTemplates,
    UPDATE_TEMPLATE
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";

const initialState = {
    guides: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/guide`;

const templatesReducer = (state = initialState, action) => {

    switch (action.type) {

        case LOAD_TEMPLATES: {
            console.log(action.type)
            const { forceFetch } = action.payload;

            if (forceFetch || (state.guides.length === 0 && !state.loading)) {
                getAccessTokenSilently()
                    .then(token => axios.get(URL, config(token)))
                    .then(res => store.dispatch(setTemplates(res.data || [])))
                    .catch(reason => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case SET_TEMPLATES: {
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

        case ADD_TEMPLATE: {
            console.log(action.type)
            const { guide } = action.payload;
            guide.guideId = Date.now().toString()

            getAccessTokenSilently()
                .then(token => axios.post(URL, guide, config(token)))
                .then(() => console.log(`Template added: ${JSON.stringify(guide)}`))
                .then(() => {
                    store.dispatch(loadTemplates(true));
                })
                .catch(reason => console.error(reason));

            return { ...state, loading: true };
        }

        case UPDATE_TEMPLATE: {
            console.log(action.type)
            const { guide } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.put(URL, guide, config(token)))
                .then(() => console.log(`Template updated: ${JSON.stringify(guide)}`))
                .then(() => store.dispatch(loadTemplates(true)))
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

        case DELETE_TEMPLATE: {
            console.log(action.type)
            const { guideId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/${guideId}`, config(token)))
                .then(() => {
                    console.log("Guide removed.");
                    store.dispatch(setTemplates(state.guides.filter(item => item.guideId !== guideId)))
                })
                .catch(reason => console.error(reason));

            return { ...state, loading: true };
        }

        default:
            return state;
    }
}

export default templatesReducer;