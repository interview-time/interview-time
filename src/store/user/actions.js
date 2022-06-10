import { getAccessTokenSilently } from "../../react-auth0-spa";
import axios from "axios";
import { config } from "../common";
import { logError } from "../../utils/log";
import { loadTemplates, setTemplates } from "../templates/actions";
import { loadInterviews, setInterviews } from "../interviews/actions";
import { loadCandidates, setCandidates } from "../candidates/actions";
import { resetTeam, loadTeam } from "../team/actions";
import { isEmpty } from "lodash/lang";

export const SET_PROFILE = "SET_PROFILE";
export const SET_ACTIVE_TEAM = "SET_ACTIVE_TEAM";
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

export const setProfile = profile => async dispatch => {
    dispatch({
        type: SET_PROFILE,
        payload: {
            profile,
        },
    });
};

/**
 * @param {Team} team
 */
export const createTeam = team => async dispatch => {
    const token = await getAccessTokenSilently();
    try {
        const newTeam = await axios.post(URL_TEAMS, team, config(token));
        const profile = await axios.get(URL_PROFILE, config(token));

        dispatch(setProfile(profile.data));
        dispatch(switchTeam(newTeam.data.teamId));
    } catch (error) {
        logError(error);
    }
};

/**
 * @param {string} teamId
 */
export const deleteTeam = teamId => async (dispatch, getState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    try {
        await axios.delete(`${URL_TEAMS}/${teamId}`, config(token));
        const profile = {
            ...user.profile,
            teams: user.profile.teams.filter(team => team.teamId !== teamId),
        };
        dispatch(setProfile(profile));
        if (!isEmpty(profile.teams)) {
            dispatch(switchTeam(profile.teams[0].teamId));
        }
    } catch (error) {
        logError(error);
    }
};

/**
 * @param {Team} team
 */
export const updateTeam = team => async (dispatch, getState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    try {
        await axios.put(URL_TEAMS, team, config(token));
        const profile = {
            ...user.profile,
            teams: user.profile.teams.map(t => (t.teamId === team.teamId ? team : t)),
        };
        dispatch(setProfile(profile));
    } catch (error) {
        logError(error);
    }
};

/**
 * @param {string} teamId
 */
export const switchTeam = teamId => async dispatch => {
    const token = await getAccessTokenSilently();
    try {
        const request = {
            currentTeamId: teamId,
        };

        axios.put(`${URL_PROFILE}/current-team`, request, config(token));

        dispatch(setActiveTeam(teamId));
        dispatch(resetData(teamId));
    } catch (error) {
        logError(error);
    }
};

/**
 * @param {string} teamId
 */
export const leaveTeam = teamId => async (dispatch, getState) => {
    const { user } = getState();

    const token = await getAccessTokenSilently();
    try {
        const request = {
            teamId: teamId,
        };
        await axios.put(`${URL_TEAMS}/leave`, request, config(token));
        const profile = {
            ...user.profile,
            teams: user.profile.teams.filter(team => team.teamId !== teamId),
        };
        dispatch(setProfile(profile));
        if (!isEmpty(profile.teams)) {
            dispatch(switchTeam(profile.teams[0].teamId));
        }
    } catch (error) {
        logError(error);
    }
};

/**
 * @param {{token: string, role: string}} team
 */
export const joinTeam = team => async dispatch => {
    const token = await getAccessTokenSilently();
    try {
        const request = {
            token: team.token,
            role: team.role,
        };
        await axios.put(`${URL_TEAMS}/join`, request, config(token));
        const profile = await axios.get(URL_PROFILE, config(token));

        dispatch(setProfile(profile.data));
    } catch (error) {
        logError(error);
    }
};

export const resetData = teamId => dispatch => {
    dispatch(setTemplates([]));
    dispatch(setInterviews([]));
    dispatch(setCandidates([]));
    dispatch(resetTeam());

    dispatch(loadTemplates());
    dispatch(loadInterviews());
    dispatch(loadCandidates());
    dispatch(loadTeam(teamId));
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

export const setActiveTeam = (teamId, reloadData = true) => ({
    type: SET_ACTIVE_TEAM,
    payload: {
        teamId,
        reloadData,
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

    dispatch(loadTeam(user.profile.currentTeamId, true));
};
