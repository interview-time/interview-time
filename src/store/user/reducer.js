import {
    ACCEPT_INVITE,
    CHANGE_ROLE,
    LOAD_TEAM_MEMBERS,
    REMOVE_MEMBER,
    REQUEST_FINISHED,
    REQUEST_STARTED,
    SET_ACTIVE_TEAM,
    SET_PROFILE,
    SET_TEAM_MEMBERS,
    setTeamMembers,
    SET_INVITE_ERROR,
} from "./actions";
import axios from "axios";
import { logError } from "../../components/utils/log";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";
import { log } from "../../components/utils/log";

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

        case SET_PROFILE: {
            const { profile } = action.payload;

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
