import { LOAD_PROFILE, SET_ACTIVE_TEAM, SET_PROFILE, setProfile, SETUP_USER, setupUser } from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";
import { getCachedActiveTeam, setCachedActiveTeam } from "../../components/utils/storage";
import { loadTemplates, setTemplates } from "../templates/actions";
import { loadInterviews, setInterviews } from "../interviews/actions";

/**
 *
 * @type {{profile: UserProfile, loading: boolean}}
 */
const initialState = {
    activeTeam: getCachedActiveTeam(),
    profile: null,
    loading: false,
};

const URL = `${process.env.REACT_APP_API_URL}/user`;

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PROFILE: {
            const { name, email, forceFetch } = action.payload;

            if (forceFetch || (!state.profile && !state.loading)) {
                getAccessTokenSilently()
                    .then((token) => axios.get(URL, config(token)))
                    .then((res) => {
                        if (!res.data) {
                            var profile = {
                                name: name,
                                email: email,
                                timezoneOffset: new Date().getTimezoneOffset(),
                            };
                            store.dispatch(setupUser(profile));
                        } else {
                            store.dispatch(setProfile(res.data || []));
                        }
                    })
                    .catch((reason) => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case SETUP_USER: {
            console.log(action.type);
            const { profile } = action.payload;

            getAccessTokenSilently()
                .then((token) => axios.post(URL, profile, config(token)))
                .then((res) => {
                    store.dispatch(setProfile(res.data));
                })
                .then(() => console.log(`Profile added: ${JSON.stringify(profile)}`))
                .catch((reason) => console.error(reason));

            return { ...state, loading: true };
        }

        case SET_PROFILE: {
            console.log(action.type);
            const { profile } = action.payload;

            return {
                ...state,
                profile: profile,
                loading: false,
            };
        }

        case SET_ACTIVE_TEAM: {
            console.log(action.type);
            const { team } = action.payload;

            setCachedActiveTeam(team);

            Promise.resolve().then(() => {
                // clean data for current team
                store.dispatch(setTemplates([]));
                store.dispatch(setInterviews([]));

                // load new data for current team
                store.dispatch(loadTemplates());
                store.dispatch(loadInterviews());
            })

            return {
                ...state,
                activeTeam: team
            };
        }

        default:
            return state;
    }
};

export default userReducer;
