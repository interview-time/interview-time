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

export const loadProfile = (name, email, forceFetch = false) => ({
    type: LOAD_PROFILE,
    payload: {
        name,
        email,
        forceFetch,
    },
});

export const setupUser = (profile) => ({
    type: SETUP_USER,
    payload: {
        profile,
    },
});

export const setProfile = (profile) => ({
    type: SET_PROFILE,
    payload: {
        profile,
    },
});

export const setActiveTeam = (team, reloadData = true) => ({
    type: SET_ACTIVE_TEAM,
    payload: {
        team,
        reloadData,
    },
});

/**
 *
 * @param {Team} team
 * @returns {{payload: {team}, type: Team}}
 */
export const createTeam = (team) => ({
    type: CREATE_TEAM,
    payload: {
        team
    }
});

/**
 *
 * @param {Team} team
 * @returns {{payload: {team}, type: Team}}
 */
export const updateTeam = (team) => ({
    type: UPDATE_TEAM,
    payload: {
        team
    }
});


/**
 *
 * @param {String} teamId
 * @returns {{payload: {teamId}, type: String}}
 */
export const deleteTeam = (teamId) => ({
    type: DELETE_TEAM,
    payload: {
        teamId
    }
});

/**
 *
 * @param {String} teamId
 * @returns {{payload: {teamId}, type: String}}
 */
export const leaveTeam = (teamId) => ({
    type: LEAVE_TEAM,
    payload: {
        teamId
    }
});

/**
 *
 * @param {String} teamId
 * @returns {{payload: {teamId}, type: String}}
 */
export const loadTeamMembers = (teamId) => ({
    type: LOAD_TEAM_MEMBERS,
    payload: {
        teamId
    }
});

/**
 *
 * @param {TeamMember[]} members
 * @returns {{payload: {members}, type: string}}
 */
export const setTeamMembers = (members) => ({
    type: SET_TEAM_MEMBERS,
    payload: {
        members
    }
});

/**
 *
 * @param {{token: string, role: string}} team
 * @returns {{payload: {token: string, role: string}, type: String}}
 */
export const joinTeam = (team) => ({
    type: JOIN_TEAM,
    payload: {
        team
    }
});