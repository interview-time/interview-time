import {
    LOAD_CANDIDATES,
    SET_CANDIDATES,
    CREATE_CANDIDATE,
    UPDATE_CANDIDATE,
    DELETE_CANDIDATE,
    GET_UPLOAD_URL,
    SET_UPLOAD_URL,
    setCandidates,
    setUploadUrl,
    loadCandidates,
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config, getActiveTeamId } from "../common";

/**
 *
 * @type {{candidates: Candidate[], loading: boolean}}
 */
const initialState = {
    candidates: [],
    uploadUrl: null,
    loading: false,
};

const URL = `${process.env.REACT_APP_API_URL}/candidate`;

const candidatesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CANDIDATES: {
            console.log(action.type);
            const { forceFetch } = action.payload;

            const teamId = getActiveTeamId();
            const url = teamId ? `${URL}/${teamId}` : URL;

            if (forceFetch || (state.candidates.length === 0 && !state.loading)) {
                getAccessTokenSilently()
                    .then((token) => axios.get(url, config(token)))
                    .then((res) => store.dispatch(setCandidates(res.data || [])))
                    .catch((reason) => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case SET_CANDIDATES: {
            console.log(action.type);
            const { candidates } = action.payload;

            return {
                ...state,
                candidates: candidates,
                loading: false,
            };
        }

        case SET_UPLOAD_URL: {
            console.log(action.type);
            const { uploadUrl } = action.payload;

            return {
                ...state,
                uploadUrl: uploadUrl,
                loading: false,
            };
        }

        case GET_UPLOAD_URL: {
            console.log(action.type);
            const { candidateId, filename } = action.payload;

            const teamId = getActiveTeamId();
            const url = `${URL}/upload-signed-url/${teamId}/${candidateId}/${filename}`;

            if (!state.loading) {
                getAccessTokenSilently()
                    .then((token) => axios.get(url, config(token)))
                    .then((res) => store.dispatch(setUploadUrl(res.data)))
                    .catch((reason) => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case CREATE_CANDIDATE: {
            console.log(action.type);
            const { candidate } = action.payload;         
            candidate.teamId = getActiveTeamId();

            getAccessTokenSilently()
                .then((token) => axios.post(URL, candidate, config(token)))
                .then(() => console.log(`Candidate created: ${JSON.stringify(candidate)}`))
                .then(() => {
                    store.dispatch(loadCandidates(true));
                })
                .catch((reason) => console.error(reason));

            return { ...state, loading: true };
        }

        case UPDATE_CANDIDATE: {
            console.log(action.type);
            const { candidate } = action.payload;

            getAccessTokenSilently()
                .then((token) => axios.put(URL, candidate, config(token)))
                .then(() => console.log(`Candidate updated: ${JSON.stringify(candidate)}`))
                .then(() => store.dispatch(loadCandidates(true)))
                .catch((reason) => console.error(reason));

            const candidates = state.candidates.map((item) => {
                if (item.candidateId !== candidate.candidateId) {
                    return item;
                }

                return {
                    ...item,
                    ...candidate,
                };
            });

            return {
                ...state,
                candidates: candidates,
            };
        }

        case DELETE_CANDIDATE: {
            console.log(action.type);
            const { candidateId } = action.payload;

            getAccessTokenSilently()
                .then((token) => axios.delete(`${URL}/${candidateId}`, config(token)))
                .then(() => {
                    console.log("Candidate removed.");
                    store.dispatch(
                        setCandidates(
                            state.candidates.filter((item) => item.candidateId !== candidateId)
                        )
                    );
                })
                .catch((reason) => console.error(reason));

            return { ...state, loading: true };
        }

        default:
            return state;
    }
};

export default candidatesReducer;
