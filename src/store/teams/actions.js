export const CREATE_TEAM = "CREATE_TEAM";
export const SET_CREATE_TEAM = "SET_CREATE_TEAM";
export const UPDATE_TEAM = "UPDATE_TEAM";
export const SET_UPDATE_TEAM = "SET_UPDATE_TEAM";

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
 * @param {Team|null} team
 * @param {String} status
 * @returns {{payload: {createTeam, status}, type: string}}
 */
export const setCreateTeam = (team, status) => ({
    type: SET_CREATE_TEAM,
    payload: {
        status,
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
 * @param {String} status
 * @returns {{payload: {status}, type: String}}
 */
export const setUpdateTeam = (status) => ({
    type: SET_UPDATE_TEAM,
    payload: {
        status
    }
});