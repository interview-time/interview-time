import { CREATE_TEAM, SET_CREATE_TEAM, SET_UPDATE_TEAM, setCreateTeam, setUpdateTeam, UPDATE_TEAM } from "./actions";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config, STATUS_ERROR, STATUS_FINISHED, STATUS_STARTED } from "../common";
import store from "../index";

const URL = `${process.env.REACT_APP_API_URL}/team`;

/**
 *
 * @type {{createTeamResult: null, updateTeamStatus: string, createTeamStatus: string}}
 */
const initialState = {
    createTeamResult: null,
    createTeamStatus:STATUS_FINISHED,
    updateTeamStatus: STATUS_FINISHED
}

const teamReducer = (state = initialState, action) => {
    switch (action.type) {

        case CREATE_TEAM: {
            console.log(action.type);
            const { team } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.post(URL, team, config(token)))
                .then(res => store.dispatch(setCreateTeam(res.data, STATUS_FINISHED)))
                .catch(reason => {
                    console.error(reason)
                    store.dispatch(setCreateTeam(null, STATUS_ERROR));
                });

            return {
                ...state,
                createTeamStatus: STATUS_STARTED,
                createTeamResult: team
            };
        }

        case SET_CREATE_TEAM: {
            console.log(action.type);
            const { status, team } = action.payload;

            return {
                ...state,
                createTeamStatus: status,
                createTeamResult: team
            };
        }

        case UPDATE_TEAM: {
            console.log(action.type);
            const { team } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.put(URL, team, config(token)))
                .then(() => store.dispatch(setUpdateTeam(STATUS_FINISHED)))
                .catch(reason => {
                    console.error(reason);
                    store.dispatch(setUpdateTeam(STATUS_ERROR));
                });

            return { ...state, updateTeamStatus: STATUS_STARTED };
        }

        case SET_UPDATE_TEAM: {
            console.log(action.type);
            const { status } = action.payload;

            return { ...state, updateTeamStatus: status };
        }

        default:
            return state;
    }
}

export default teamReducer