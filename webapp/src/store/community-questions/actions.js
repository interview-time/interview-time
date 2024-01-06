export const LOAD_COMMUNITY_CATEGORIES = "LOAD_COMMUNITY_CATEGORIES";
export const SET_COMMUNITY_CATEGORIES = "SET_COMMUNITY_CATEGORIES";

export const loadCommunityCategories = (forceFetch = false) => ({
    type: LOAD_COMMUNITY_CATEGORIES,
    payload: {
        forceFetch,
    },
});

export const setCommunityCategories = categories => ({
    type: SET_COMMUNITY_CATEGORIES,
    payload: {
        categories,
    },
});
