import {
    ADD_TEMPLATE,
    DELETE_TEMPLATE,
    LOAD_TEMPLATES,
    LOAD_LIBRARY,
    loadTemplates,
    SET_TEMPLATES,
    SET_LIBRARY,
    setTemplates,
    setLibrary,
    UPDATE_TEMPLATE,
    LOAD_SHARED_TEMPLATE,
    SET_SHARED_TEMPLATE,
    setSharedTemplate,
} from "./actions";
import axios from "axios";
import store from "../../store";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../common";

/**
 *
 * @type {{templates: Template[], library: Template[], loading: boolean, loadingLibrary: boolean}}
 */
const initialState = {
    templates: [],
    library: [],
    loading: false,
    loadingLibrary: false,
    sharedTemplate: null,
};

const URL = `${process.env.REACT_APP_API_URL}/template`;

const templatesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_TEMPLATES: {
            console.log(action.type);
            const { forceFetch } = action.payload;

            if (forceFetch || (state.templates.length === 0 && !state.loading)) {
                getAccessTokenSilently()
                    .then((token) => axios.get(URL, config(token)))
                    .then((res) => store.dispatch(setTemplates(res.data || [])))
                    .catch((reason) => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case LOAD_LIBRARY: {
            console.log(action.type);
            const { forceFetch } = action.payload;

            if (forceFetch || (state.library.length === 0 && !state.loadingLibrary)) {
                getAccessTokenSilently()
                    .then((token) => axios.get(`${URL}/library`, config(token)))
                    .then((res) => store.dispatch(setLibrary(res.data || [])))
                    .catch((reason) => console.error(reason));

                return { ...state, loadingLibrary: true };
            }

            return { ...state };
        }

        case SET_TEMPLATES: {
            console.log(action.type);
            const { templates } = action.payload;

            // helps to avoid dealing with null collections
            templates.forEach((template) => {
                template.structure.groups.forEach((group) => {
                    if (!group.questions) {
                        group.questions = [];
                    }
                });
            });
            return {
                ...state,
                templates: templates,
                loading: false,
            };
        }

        case SET_LIBRARY: {
            console.log(action.type);
            const { library } = action.payload;

            // helps to avoid dealing with null collections
            library.forEach((template) => {
                template.structure.groups.forEach((group) => {
                    if (!group.questions) {
                        group.questions = [];
                    }
                });
            });
            return {
                ...state,
                library: library,
                loadingLibrary: false,
            };
        }

        case ADD_TEMPLATE: {
            console.log(action.type);
            const { template } = action.payload;
            template.templateId = Date.now().toString();

            getAccessTokenSilently()
                .then((token) => axios.post(URL, template, config(token)))
                .then(() => console.log(`Template added: ${JSON.stringify(template)}`))
                .then(() => {
                    store.dispatch(loadTemplates(true));
                })
                .catch((reason) => console.error(reason));

            return { ...state, loading: true };
        }

        case UPDATE_TEMPLATE: {
            console.log(action.type);
            const { template } = action.payload;

            getAccessTokenSilently()
                .then((token) => axios.put(URL, template, config(token)))
                .then(() => console.log(`Template updated: ${JSON.stringify(template)}`))
                .then(() => store.dispatch(loadTemplates(true)))
                .catch((reason) => console.error(reason));

            const templates = state.templates.map((item) => {
                if (item.templateId !== template.templateId) {
                    return item;
                }

                return {
                    ...item,
                    ...template,
                };
            });

            return {
                ...state,
                templates: templates,
            };
        }

        case DELETE_TEMPLATE: {
            console.log(action.type);
            const { templateId } = action.payload;

            getAccessTokenSilently()
                .then((token) => axios.delete(`${URL}/${templateId}`, config(token)))
                .then(() => {
                    console.log("Template removed.");
                    store.dispatch(
                        setTemplates(state.templates.filter((item) => item.templateId !== templateId))
                    );
                })
                .catch((reason) => console.error(reason));

            return { ...state, loading: true };
        }

        case LOAD_SHARED_TEMPLATE: {
            console.log(action.type);
            const { token } = action.payload;

            if (!state.loading) {
                axios
                    .get(`${URL}/shared/${token}`)
                    .then((res) => store.dispatch(setSharedTemplate(res.data || [])))
                    .catch((reason) => console.error(reason));

                return { ...state, loading: true };
            }

            return { ...state };
        }

        case SET_SHARED_TEMPLATE: {
            console.log(action.type);
            const { template } = action.payload;

            return {
                ...state,
                sharedTemplate: template,
                loading: false,
            };
        }

        default:
            return state;
    }
};

export default templatesReducer;
