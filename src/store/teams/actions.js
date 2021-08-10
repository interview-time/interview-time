export const CREATE_TEAM = "CREATE_TEAM";
export const SET_LOADING = "SET_LOADING";

/**
 *
 * @param {Team} team
 * @returns {{payload: {team}, type: string}}
 */
export const createTeam = (team) => ({
    type: CREATE_TEAM,
    payload: {
        team
    }
});

/**
 *
 * @param {boolean} loading
 * @returns {{payload: {loading}, type: boolean}}
 */
export const setLoading = (loading) => ({
    type: SET_LOADING,
    payload: {
        loading
    }
});