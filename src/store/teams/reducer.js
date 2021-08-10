import { CREATE_TEAM, SET_LOADING, setLoading } from "./actions";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import store from "../index";

const URL = `${process.env.REACT_APP_API_URL}/team`;

const initialState = {
    loading: false
}

const teamReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_LOADING: {
            console.log(action.type);
            const { loading } = action.payload;

            return { ...state, loading: loading };
        }

        case CREATE_TEAM: {
            console.log(action.type);
            const { team } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.post(URL, team, config(token)))
                .then(() => store.dispatch(setLoading(false)))
                .catch(reason => console.error(reason));

            return { ...state, loading: true };
        }
        default:
            return state;
    }
}

export default teamReducer