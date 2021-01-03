import {ADD_GUIDE, DELETE_GUIDE, LOAD_GUIDES, SET_GUIDES, setGuides, UPDATE_GUIDE} from "./actions";
import axios from "axios";
import store from "../../store";

const initialState = {
    guides: [],
    loading: false
};

const URL = `${process.env.REACT_APP_API_URL}/guide`;

export default function (state = initialState, action) {
    console.log(action.type)
    switch (action.type) {
        case LOAD_GUIDES: {
            if (state.guides.length === 0) {
                axios
                    .get(URL, null)
                    .then(res => {
                        store.dispatch(setGuides(res.data || []));
                        console.log("Guides loaded.")
                    })
                    .catch((reason) => console.error(reason));

                return {...state, loading: true};
            }

            return state;
        }

        case SET_GUIDES: {
            const {guides} = action.payload;
            return {
                ...state,
                guides: guides,
                loading: false
            };
        }

        case ADD_GUIDE: {
            const {guide} = action.payload;
            const localId = Date.now().toString()
            axios
                .post(URL, guide, null)
                .then(res => {
                    const guides = state.guides.filter(item => item.guideId !== localId);
                    store.dispatch(setGuides([...guides, res.data]))
                    console.log("Guide added.")
                })
                .catch((reason) => console.error(reason));

            guide.id = localId
            return {
                ...state,
                guides: [...state.guides, guide]
            };
        }

        case UPDATE_GUIDE: {
            const {guide} = action.payload;
            axios
                .put(URL, guide, null)
                .then(() => console.log("Guide updated."))
                .catch((reason) => console.error(reason));

            const guides = state.guides.map(item => {
                if (item.guideId !== guide.guideId) {
                    return item;
                }

                return {
                    ...item, ...guide
                }
            });

            return {
                ...state,
                guides: guides
            };
        }

        case DELETE_GUIDE: {
            const {guideId} = action.payload;

            axios
                .delete(`${URL}/${guideId}`)
                .then(() => console.log("Guide removed."))
                .catch((reason) => console.error(reason));

            const guides = state.guides.filter(item => item.guideId !== guideId);
            return {
                ...state,
                guides: guides
            };
        }

        default:
            return state;
    }
}
