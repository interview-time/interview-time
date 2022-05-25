import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import { logError } from "../../components/utils/log";
import { loadTemplates, setTemplates } from "../templates/actions";
import { loadInterviews, setInterviews } from "../interviews/actions";
import { loadCandidates, setCandidates } from "../candidates/actions";
import { getPendingInvites, setPendingInvites } from "../teams/actions";

export const LOAD_PROFILE = "LOAD_PROFILE";
export const SETUP_USER = "SETUP_USER";
export const SET_PROFILE = "SET_PROFILE";
export const SET_ACTIVE_TEAM = "SET_ACTIVE_TEAM";
export const CREATE_TEAM = "CREATE_TEAM";
export const UPDATE_TEAM = "UPDATE_TEAM";
export const DELETE_TEAM = "DELETE_TEAM";
export const JOIN_TEAM = "JOIN_TEAM";
export const LEAVE_TEAM = "LEAVE_TEAM";
export const LOAD_TEAM_MEMBERS = "LOAD_TEAM_MEMBERS";
export const SET_TEAM_MEMBERS = "SET_TEAM_MEMBERS";
export const CHANGE_ROLE = "CHANGE_ROLE";
export const REMOVE_MEMBER = "REMOVE_MEMBER";
export const ACCEPT_INVITE = "ACCEPT_INVITE";
export const REQUEST_STARTED = "REQUEST_STARTED";
export const REQUEST_FINISHED = "REQUEST_FINISHED";
export const SET_INVITE_ERROR = "SET_INVITE_ERROR";

const URL_PROFILE = `${process.env.REACT_APP_API_URL}/user`;
const URL_TEAMS = `${process.env.REACT_APP_API_URL}/team`;

export const loadProfile = (name, email, inviteToken) => async (dispatch, getState) => {
    try {
        const { user } = getState();

        if (!user.profile && !user.loading) {
            dispatch(requestStarted());

            const token = await getAccessTokenSilently();

            let profile = await axios.get(URL_PROFILE, config(token));

            if (!profile.data) {
                const request = {
                    name: name,
                    email: email,
                    timezoneOffset: new Date().getTimezoneOffset(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                };

                profile = await axios.post(URL_PROFILE, request, config(token));
            }

            if (inviteToken && !user.acceptedInvites.includes(inviteToken)) {
                const acceptInviteRequest = {
                    inviteToken: inviteToken,
                };

                try {
                    await axios.put(`${URL_TEAMS}/accept-invite`, acceptInviteRequest, config(token));

                    dispatch(acceptInvite(inviteToken));

                    profile = await axios.get(URL_PROFILE, config(token));
                } catch (error) {
                    if (error.response.status === 404) {
                        logError(`Invite '${inviteToken}' has expired or the team was deleted`);
                        dispatch(setInviteError(true));
                    } else {
                        throw error;
                    }
                }
            }

            dispatch(setProfile(profile.data));
            dispatch(resetData(profile.data.currentTeamId));
        }
    } catch (err) {
        logError(err);
    } finally {
        dispatch(requestFinished());
    }
};

export const switchTeam = teamId => async dispatch => {
    const token = await getAccessTokenSilently();
    const request = {
        currentTeamId: teamId,
    };

    axios.put(`${URL_PROFILE}/current-team`, request, config(token));

    dispatch(setActiveTeam(teamId));
    dispatch(resetData(teamId));
};

export const resetData = teamId => dispatch => {
    dispatch(setTemplates([]));
    dispatch(setInterviews([]));
    dispatch(setCandidates([]));
    dispatch(setTeamMembers([]));
    dispatch(setPendingInvites([]));

    dispatch(loadTemplates());
    dispatch(loadInterviews());
    dispatch(loadCandidates());
    dispatch(loadTeamMembers(teamId));
    dispatch(getPendingInvites(teamId));
};

export const acceptInvite = inviteToken => ({
    type: ACCEPT_INVITE,
    payload: { inviteToken },
});

export const requestStarted = () => ({
    type: REQUEST_STARTED,
});

export const requestFinished = () => ({
    type: REQUEST_FINISHED,
});

export const setInviteError = isInviteError => ({
    type: SET_INVITE_ERROR,
    payload: {
        isInviteError: isInviteError,
    },
});

export const setupUser = profile => ({
    type: SETUP_USER,
    payload: {
        profile,
    },
});

export const setProfile = profile => ({
    type: SET_PROFILE,
    payload: {
        profile,
    },
});

export const setActiveTeam = (teamId, reloadData = true) => ({
    type: SET_ACTIVE_TEAM,
    payload: {
        teamId,
        reloadData,
    },
});

/**
 *
 * @param {Team} team
 * @returns {{payload: {team}, type: Team}}
 */
export const createTeam = team => ({
    type: CREATE_TEAM,
    payload: {
        team,
    },
});

/**
 *
 * @param {Team} team
 * @returns {{payload: {team}, type: Team}}
 */
export const updateTeam = team => ({
    type: UPDATE_TEAM,
    payload: {
        team,
    },
});

/**
 *
 * @param {String} teamId
 * @returns {{payload: {teamId}, type: String}}
 */
export const deleteTeam = teamId => ({
    type: DELETE_TEAM,
    payload: {
        teamId,
    },
});

/**
 *
 * @param {String} teamId
 * @returns {{payload: {teamId}, type: String}}
 */
export const leaveTeam = teamId => ({
    type: LEAVE_TEAM,
    payload: {
        teamId,
    },
});

/**
 *
 * @param {String} teamId
 * @returns {{payload: {teamId}, type: String}}
 */
export const loadTeamMembers = teamId => ({
    type: LOAD_TEAM_MEMBERS,
    payload: {
        teamId,
    },
});

/**
 *
 * @param {TeamMember[]} members
 * @returns {{payload: {members}, type: string}}
 */
export const setTeamMembers = members => ({
    type: SET_TEAM_MEMBERS,
    payload: {
        members,
    },
});

/**
 *
 * @param {{token: string, role: string}} team
 * @returns {{payload: {token: string, role: string}, type: String}}
 */
export const joinTeam = team => ({
    type: JOIN_TEAM,
    payload: {
        team,
    },
});

export const changeRole = (userId, teamId, newRole) => ({
    type: CHANGE_ROLE,
    payload: {
        userId,
        teamId,
        newRole,
    },
});

export const removeMember = (userId, teamId) => ({
    type: REMOVE_MEMBER,
    payload: {
        userId,
        teamId,
    },
});

export const inviteUser = (email, role) => async (dispatch, getState) => {
    const { user } = getState();
    const token = await getAccessTokenSilently();

    const request = {
        email: email,
        teamId: user.profile.currentTeamId,
        role: role,
    };

    try {
        await axios.put(`${URL_TEAMS}/invite`, request, config(token));
    } catch (error) {
        logError(error);
    }
};
