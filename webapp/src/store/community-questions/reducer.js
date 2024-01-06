import { LOAD_COMMUNITY_CATEGORIES, SET_COMMUNITY_CATEGORIES, setCommunityCategories } from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";

const initialState = {
    categories: [],
    loading: false,
};

const URL = `${process.env.REACT_APP_API_URL}/community/categories/questions`;

const communityQuestionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_COMMUNITY_CATEGORIES: {
            const { forceFetch } = action.payload;

            if (forceFetch || (state.categories.length === 0 && !state.loading)) {
                getAccessTokenSilently()
                    .then(token => axios.get(URL, config(token)))
                    .then(res => {
                        const categories = res.data;
                        return store.dispatch(setCommunityCategories(categories));
                    })
                    .catch(reason => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case SET_COMMUNITY_CATEGORIES: {
            const { categories } = action.payload;
            return {
                ...state,
                categories: categories,
                loading: false,
            };
        }

        default:
            return state;
    }
};

export default communityQuestionsReducer;
