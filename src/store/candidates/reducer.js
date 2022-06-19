import {
    CREATE_CANDIDATE,
    DELETE_CANDIDATE,
    GET_UPLOAD_URL,
    LOAD_CANDIDATES,
    loadCandidates,
    SET_CANDIDATES,
    SET_UPLOAD_URL,
    setCandidates,
    setUploadUrl,
    UPDATE_CANDIDATE,
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";
import { log } from "../../utils/log";

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
            const { forceFetch, teamId } = action.payload;

            if (forceFetch || (state.candidates.length === 0 && !state.loading)) {
                getAccessTokenSilently()
                    .then(token => axios.get(`${URL}/${teamId}`, config(token)))
                    .then(res => store.dispatch(setCandidates(res.data || [])))
                    .catch(reason => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case SET_CANDIDATES: {
            const { candidates } = action.payload;

            return {
                ...state,
                candidates: candidates,
                loading: false,
            };
        }

        case SET_UPLOAD_URL: {
            const { uploadUrl } = action.payload;

            return {
                ...state,
                uploadUrl: uploadUrl,
                loading: false,
            };
        }

        case GET_UPLOAD_URL: {
            const { candidateId, filename, teamId } = action.payload;

            const url = `${URL}/upload-signed-url/${teamId}/${candidateId}/${filename}`;

            if (!state.loading) {
                getAccessTokenSilently()
                    .then(token => axios.get(url, config(token)))
                    .then(res => store.dispatch(setUploadUrl(res.data)))
                    .catch(reason => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case CREATE_CANDIDATE: {
            const { candidate, teamId } = action.payload;
            candidate.teamId = teamId;

            getAccessTokenSilently()
                .then(token => axios.post(URL, candidate, config(token)))
                .then(() => log(`Candidate created: ${JSON.stringify(candidate)}`))
                .then(() => {
                    store.dispatch(loadCandidates(true));
                })
                .catch(reason => console.error(reason));

            return { ...state, loading: true };
        }

        case UPDATE_CANDIDATE: {
            const { candidate, teamId } = action.payload;
            candidate.teamId = teamId;

            getAccessTokenSilently()
                .then(token => axios.put(URL, candidate, config(token)))
                .then(() => log(`Candidate updated: ${JSON.stringify(candidate)}`))
                .then(() => store.dispatch(loadCandidates(true)))
                .catch(reason => console.error(reason));

            const candidates = state.candidates.map(item => {
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
            const { candidateId, teamId } = action.payload;

            getAccessTokenSilently()
                .then(token => axios.delete(`${URL}/${candidateId}/team/${teamId}`, config(token)))
                .then(() => log("Candidate removed."))
                .catch(reason => console.error(reason));

            return {
                ...state,
                candidates: state.candidates.filter(item => item.candidateId !== candidateId),
            };
        }

        default:
            return state;
    }
};

export default candidatesReducer;
