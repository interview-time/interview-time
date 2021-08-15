export const LOAD_PROFILE = "LOAD_PROFILE";
export const SETUP_USER = "SETUP_USER";
export const SET_PROFILE = "SET_PROFILE";
export const SET_ACTIVE_TEAM = "SET_ACTIVE_TEAM";

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

export const setActiveTeam = (team) => ({
    type: SET_ACTIVE_TEAM,
    payload: {
        team,
    },
});
