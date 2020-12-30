import {
    LOAD_GUIDES,
    SET_GUIDES,
    ADD_GUIDE,
    UPDATE_GUIDE,
    DELETE_GUIDE
} from "./actions";
import axios from "axios";
import store from "../../store";
import {setGuides} from "./actions";

const initialState = {
    guides: [],
    loading: false
};

const data = [
    {
        id: '1',
        title: 'Senior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        category: 'Technical',
        structure: {
            header: 'Hello world header',
            footer: 'Hello World footer',
            groups: [
                {
                    id: '1',
                    name: 'Android',
                    questions: [
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?"
                    ]
                },
                {
                    id: '2',
                    name: 'Java',
                    questions: [
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?"
                    ]
                }
            ]
        },
        totalQuestions: 10,
        totalInterviews: 12,
        description: 'This guid helps to evaluate overall knowledge about Android SDK.'
    },
    {
        id: '2',
        title: 'Middle Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        category: 'Technical',
        structure: {
            header: 'Hello world header',
            footer: 'Hello World footer',
            groups: [
                {
                    id: '1',
                    title: 'Android',
                    questions: [
                        "What are configuration changes and when do they happen 1?",
                        "What are configuration changes and when do they happen 2?",
                        "What are configuration changes and when do they happen 3?",
                        "What are configuration changes and when do they happen 4? ",
                        "What are configuration changes and when do they happen 5?"
                    ]
                }
            ]
        },
        totalQuestions: 10,
        totalInterviews: 12,
        description: 'This guid helps to evaluate overall knowledge about Android SDK.'
    }
];

export default function (state = initialState, action) {
    console.log(action.type)
    switch (action.type) {
        case LOAD_GUIDES: {
            if (state.guides.length === 0) {
                axios
                    // TODO replace with valid network request
                    .get(`${process.env.REACT_APP_API_URL}/question-bank/categories`, null)
                    .then(res => {
                        store.dispatch(setGuides(data || []));
                    })
                    .catch((reason) => {
                        console.error(reason)
                    });

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

            // TODO add network request

            guide.id = Date.now().toString()
            return {
                ...state,
                guides: [...state.guides, guide]
            };
        }

        case UPDATE_GUIDE: {
            const {guide} = action.payload;

            // TODO add network request

            const index = state.guides.findIndex(item => item.id === guide.id);
            if (index >= 0) {
                state.guides[index] = guide;
            }

            return state;
        }

        case DELETE_GUIDE: {
            const {guideId} = action.payload;

            // TODO add network request

            const guides = state.guides.filter(guide => guide.id !== guideId);
            return {
                ...state,
                guides: guides
            };
        }

        default:
            return state;
    }
}
