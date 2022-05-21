import {
    ACCEPT_INVITE,
    CHANGE_ROLE,
    CREATE_TEAM,
    DELETE_TEAM,
    JOIN_TEAM,
    LEAVE_TEAM,
    LOAD_TEAM_MEMBERS,
    REMOVE_MEMBER,
    REQUEST_FINISHED,
    REQUEST_STARTED,
    SET_ACTIVE_TEAM,
    SET_PROFILE,
    SET_TEAM_MEMBERS,
    setActiveTeam,
    setProfile,
    setTeamMembers,
    SETUP_USER,
    UPDATE_TEAM,
    SET_INVITE_ERROR,
} from "./actions";
import axios from "axios";
import { logError } from "../../components/utils/log";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";
import { log } from "../../components/utils/log";
import { isEmpty } from "lodash/lang";

/**
 *
 * @type {{profile: UserProfile, activeTeam: {teamName: string,teamId: string}, loading: boolean, teamMembers: TeamMember[]}}
 */
const initialState = {
    profile: null,
    loading: false,
    activeTeam: null,
    teamMembers: [],
    acceptedInvites: [],
    inviteError: false,
};

const URL_PROFILE = `${process.env.REACT_APP_API_URL}/user`;
const URL_TEAMS = `${process.env.REACT_APP_API_URL}/team`;

const userReducer = (state = initialState, action) => {
    log(action.type);

    switch (action.type) {
        case SET_INVITE_ERROR: {
            const { isInviteError } = action.payload;
            return { ...state, inviteError: isInviteError };
        }

        case REQUEST_STARTED: {
            return { ...state, loading: true };
        }

        case REQUEST_FINISHED: {
            return { ...state, loading: false };
        }

        case SETUP_USER: {
            const { profile } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.post(URL_PROFILE, profile, config(token)))
                .then(res => {
                    store.dispatch(setProfile(res.data));
                })
                .then(() => log(`Profile added: ${JSON.stringify(profile)}`))
                .catch(reason => logError(reason));

            return { ...state, loading: true };
        }

        case SET_PROFILE: {
            const { profile } = action.payload;

            // active team is not set (old users only) or user is not member of active team
            if (!profile.currentTeamId || !profile.teams.find(team => team.teamId === profile.currentTeamId)) {
                Promise.resolve().then(() => {
                    if (!isEmpty(profile.teams)) {
                        store.dispatch(setActiveTeam(profile.teams[0].teamId));
                    }
                });
            }

            return {
                ...state,
                profile: profile,
                loading: false,
            };
        }

        case SET_ACTIVE_TEAM: {
            const { teamId } = action.payload;

            return {
                ...state,
                profile: {
                    ...state.profile,
                    currentTeamId: teamId,
                },
            };
        }

        case CREATE_TEAM: {
            const { team } = action.payload;

            getAccessTokenSilently()
                .then(token => {
                    // create team
                    const tokenPromise = Promise.resolve(token);
                    const teamPromise = axios.post(URL_TEAMS, team, config(token));
                    return Promise.all([tokenPromise, teamPromise]);
                })
                .then(res => {
                    // load profile which contains teams array
                    const token = res[0];
                    const team = res[1].data;

                    const teamPromise = Promise.resolve(team);
                    const profilePromise = axios.get(URL_PROFILE, config(token));

                    return Promise.all([teamPromise, profilePromise]);
                })
                .then(res => {
                    const team = res[0];
                    const profile = res[1].data;

                    store.dispatch(setProfile(profile || []));
                    store.dispatch(setActiveTeam(team.teamId));
                })
                .catch(reason => logError(reason));

            return state;
        }

        case UPDATE_TEAM: {
            const { team } = action.payload;

            getAccessTokenSilently()
                .then(token => {
                    // update team
                    const tokenPromise = Promise.resolve(token);
                    const teamPromise = axios.put(URL_TEAMS, team, config(token));

                    return Promise.all([tokenPromise, teamPromise]);
                })
                .then(res => {
                    // load profile which contains teams array
                    const token = res[0];
                    return axios.get(URL_PROFILE, config(token));
                })
                .then(res => {
                    const profile = res.data;
                    store.dispatch(setProfile(profile || []));
                })
                .catch(reason => logError(reason));

            return state;
        }

        case DELETE_TEAM: {
            const { teamId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL_TEAMS}/${teamId}`, config(token)))
                .then(() => {
                    log("Team removed.");
                    const profile = {
                        ...state.profile,
                        teams: state.profile.teams.filter(team => team.teamId !== teamId),
                    };
                    store.dispatch(setProfile(profile));
                })
                .catch(reason => logError(reason));

            return state;
        }

        case LOAD_TEAM_MEMBERS: {
            const { teamId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.get(`${URL_TEAMS}/members/${teamId}`, config(token)))
                .then(res => store.dispatch(setTeamMembers(res.data || [])))
                .catch(reason => logError(reason));

            return state;
        }

        case SET_TEAM_MEMBERS: {
            const { members } = action.payload;

            return {
                ...state,
                teamMembers: members || [],
            };
        }

        case JOIN_TEAM: {
            const { team } = action.payload;

            const data = {
                token: team.token,
                role: team.role,
            };

            getAccessTokenSilently()
                .then(token => {
                    // join team
                    const tokenPromise = Promise.resolve(token);
                    const teamPromise = axios.put(`${URL_TEAMS}/join`, data, config(token));
                    return Promise.all([tokenPromise, teamPromise]);
                })
                .then(res => {
                    // load profile which contains teams array
                    const token = res[0];
                    return axios.get(URL_PROFILE, config(token));
                })
                .then(res => {
                    const profile = res.data;
                    store.dispatch(setProfile(profile || []));
                })
                .catch(reason => logError(reason));

            return state;
        }

        case LEAVE_TEAM: {
            const { teamId } = action.payload;

            const data = {
                teamId: teamId,
            };

            getAccessTokenSilently()
                .then(token => axios.put(`${URL_TEAMS}/leave`, data, config(token)))
                .then(() => {
                    log("Team left.");
                    const profile = {
                        ...state.profile,
                        teams: state.profile.teams.filter(team => team.teamId !== teamId),
                    };
                    store.dispatch(setProfile(profile));
                })
                .catch(reason => logError(reason));

            return state;
        }

        case CHANGE_ROLE: {
            const { userId, teamId, newRole } = action.payload;

            const request = {
                teamId: teamId,
                memberId: userId,
                newRole: newRole,
            };

            getAccessTokenSilently()
                .then(token => axios.put(`${URL_TEAMS}/member`, request, config(token)))
                .then(() => {
                    const teamMembers = state.teamMembers.map(tm =>
                        tm.userId === userId ? { ...tm, roles: [newRole] } : tm
                    );

                    store.dispatch(setTeamMembers(teamMembers));
                });

            return state;
        }

        case REMOVE_MEMBER: {
            const { userId, teamId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL_TEAMS}/member/${userId}/team/${teamId}`, config(token)))
                .then(() => {
                    const teamMembers = state.teamMembers.filter(tm => tm.userId !== userId);
                    store.dispatch(setTeamMembers(teamMembers));
                })
                .catch(reason => logError(reason));

            return state;
        }

        case ACCEPT_INVITE: {
            const { inviteToken } = action.payload;

            return {
                ...state,
                acceptedInvites: [...state.acceptedInvites, inviteToken],
            };
        }

        default:
            return state;
    }
};

export default userReducer;
