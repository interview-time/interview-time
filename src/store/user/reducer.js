import {
    CREATE_TEAM,
    DELETE_TEAM,
    JOIN_TEAM, LEAVE_TEAM,
    LOAD_PROFILE,
    LOAD_TEAM_MEMBERS,
    SET_ACTIVE_TEAM,
    SET_PROFILE,
    SET_TEAM_MEMBERS,
    setActiveTeam,
    setProfile,
    setTeamMembers,
    SETUP_USER,
    setupUser,
    UPDATE_TEAM
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";
import { getCachedActiveTeam, setCachedActiveTeam } from "../../components/utils/storage";
import { loadTemplates, setTemplates } from "../templates/actions";
import { loadInterviews, setInterviews } from "../interviews/actions";

/**
 *
 * @type {{profile: UserProfile, activeTeam: any, loading: boolean, teamMembers: TeamMember[]}}
 */
const initialState = {
    profile: null,
    loading: false,
    activeTeam: getCachedActiveTeam(),
    teamMembers: []
};

const URL_PROFILE = `${process.env.REACT_APP_API_URL}/user`;
const URL_TEAMS = `${process.env.REACT_APP_API_URL}/team`;

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PROFILE: {
            const { name, email, forceFetch } = action.payload;

            if (forceFetch || (!state.profile && !state.loading)) {
                getAccessTokenSilently()
                    .then((token) => axios.get(URL_PROFILE, config(token)))
                    .then((res) => {
                        if (!res.data) {
                            const profile = {
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
                .then((token) => axios.post(URL_PROFILE, profile, config(token)))
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
            const { team, reloadData } = action.payload;

            setCachedActiveTeam(team);

            if (reloadData) {
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
                    activeTeam: team,
                    teamMembers: []
                };
            }

            return {
                ...state,
                activeTeam: team
            };
        }

        case CREATE_TEAM: {
            console.log(action.type);
            const { team } = action.payload;

            getAccessTokenSilently()
                .then(token => { // create team
                    const tokenPromise = Promise.resolve(token);
                    const teamPromise = axios.post(URL_TEAMS, team, config(token));
                    return Promise.all([tokenPromise, teamPromise]);
                })
                .then((res) => { // load profile which contains teams array
                    const token = res[0]
                    const team = res[1].data

                    const teamPromise = Promise.resolve(team)
                    const profilePromise = axios.get(URL_PROFILE, config(token))

                    return Promise.all([teamPromise, profilePromise]);
                })
                .then((res) => {
                    const team = res[0]
                    const profile = res[1].data

                    store.dispatch(setActiveTeam({
                        teamId: team.teamId,
                        teamName: team.name
                    }))
                    store.dispatch(setProfile(profile || []));
                })
                .catch(reason => console.error(reason));

            return state;
        }

        case UPDATE_TEAM: {
            console.log(action.type);
            const { team } = action.payload;

            getAccessTokenSilently()
                .then(token => { // update team
                    const tokenPromise = Promise.resolve(token);
                    const teamPromise = axios.put(URL_TEAMS, team, config(token));

                    return Promise.all([tokenPromise, teamPromise]);
                })
                .then((res) => { // load profile which contains teams array
                    const token = res[0]
                    return axios.get(URL_PROFILE, config(token));
                })
                .then((res) => {
                    const profile = res.data
                    store.dispatch(setProfile(profile || []));
                    store.dispatch(setActiveTeam({
                        teamId: team.teamId,
                        teamName: team.teamName
                    }, false))
                })
                .catch(reason => console.error(reason));

            return state;
        }

        case DELETE_TEAM: {
            console.log(action.type);
            const { teamId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL_TEAMS}/${teamId}`, config(token)))
                .then(() => {
                    console.log("Team removed.");
                    const profile = {
                        ...state.profile,
                        teams: state.profile.teams.filter(team => team.teamId !== teamId)
                    }
                    store.dispatch(setProfile(profile));
                    store.dispatch(setActiveTeam(null, false))
                })
                .catch(reason => console.error(reason));

            return state;
        }

        case LOAD_TEAM_MEMBERS: {
            console.log(action.type);
            const { teamId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.get(`${URL_TEAMS}/members/${teamId}`, config(token)))
                .then((res) => store.dispatch(setTeamMembers(res.data || [])))
                .catch(reason => console.error(reason));

            return state;
        }

        case SET_TEAM_MEMBERS: {
            console.log(action.type);
            const { members } = action.payload;

            return {
                ...state,
                teamMembers: members || []
            };
        }

        case JOIN_TEAM: {
            console.log(action.type);
            const { token } = action.payload;

            const data = {
                token: token
            }

            getAccessTokenSilently()
                .then(token => { // join team
                    const tokenPromise = Promise.resolve(token);
                    const teamPromise = axios.put(`${URL_TEAMS}/join`, data, config(token))
                    return Promise.all([tokenPromise, teamPromise]);
                })
                .then((res) => { // load profile which contains teams array
                    const token = res[0]
                    return axios.get(URL_PROFILE, config(token));
                })
                .then((res) => {
                    const profile = res.data
                    store.dispatch(setProfile(profile || []));
                })
                .catch(reason => console.error(reason));

            return state;
        }

        case LEAVE_TEAM: {
            console.log(action.type);
            const { teamId } = action.payload;

            const data = {
                teamId: teamId
            }

            getAccessTokenSilently()
                .then(token => axios.put(`${URL_TEAMS}/leave`, data, config(token)))
                .then(() => {
                    console.log("Team left.");
                    const profile = {
                        ...state.profile,
                        teams: state.profile.teams.filter(team => team.teamId !== teamId)
                    }
                    store.dispatch(setProfile(profile));
                    store.dispatch(setActiveTeam(null, false))
                })
                .catch(reason => console.error(reason));

            return state;
        }

        default:
            return state;
    }
};

export default userReducer;
