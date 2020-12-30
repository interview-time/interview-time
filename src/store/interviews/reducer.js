import {
    LOAD_INTERVIEWS,
    SET_INTERVIEWS,
    ADD_INTERVIEW,
    UPDATE_INTERVIEW,
    DELETE_INTERVIEW
} from "./actions";
import axios from "axios";
import store from "../../store";
import {setInterviews} from "./actions";

const initialState = {
    interviews: [],
    loading: false
};

const ASSESSMENT_YES = 'yes';
const ASSESSMENT_NO = 'no';
const ASSESSMENT_STRONG_YES = 'strong yes';
const ASSESSMENT_STRONG_NO = 'strong no';
const STATUS_COMPLETED = 'Completed';
const STATUS_SCHEDULED = 'Scheduled';

const data = [
    {
        id: '1',
        name: 'John Brown',
        position: 'Software Engineer',
        guide: 'Android Developer',
        date: '2020-12-25 22:51',
        tags: [ASSESSMENT_STRONG_YES],
        status: STATUS_COMPLETED,
        structure: {
            header: 'Hello world header',
            footer: 'Hello World footer',
            groups: [
                {
                    id: '1',
                    name: 'Android',
                    questions: [
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?"
                    ]
                },
                {
                    id: '2',
                    name: 'Java',
                    questions: [
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?"
                    ]
                }
            ]
        },
    },
    {
        id: '2',
        name: 'Dmytro Danylyk',
        position: 'Software Engineer',
        guide: 'Android Developer',
        date: '12-02-2020 09:30',
        tags: [ASSESSMENT_NO],
        status: STATUS_COMPLETED,
        structure: {
            header: 'Hello world header',
            footer: 'Hello World footer',
            groups: [
                {
                    id: '1',
                    name: 'Android',
                    questions: [
                        "What are configuration changes and when do they happen?",
                        "What are configuration changes and when do they happen?"
                    ]
                }
            ]
        },
    },
    {
        id: '3',
        name: 'Julia Danylyk',
        position: 'Software Engineer',
        guide: 'Android Developer',
        date: '14-03-2020 09:30',
        tags: [],
        status: STATUS_SCHEDULED,
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
                    ]
                }
            ]
        },
    },
];

export default function (state = initialState, action) {
    console.log(action.type)
    switch (action.type) {
        case LOAD_INTERVIEWS: {
            if (state.interviews.length === 0) {
                axios
                    // TODO replace with valid network request
                    .get(`${process.env.REACT_APP_API_URL}/question-bank/categories`, null)
                    .then(res => {
                        store.dispatch(setInterviews(data || []));
                    })
                    .catch((reason) => {
                        console.error(reason)
                    });

                return {...state, loading: true};
            }

            return state;
        }

        case SET_INTERVIEWS: {
            const {interviews} = action.payload;
            return {
                ...state,
                interviews: interviews,
                loading: false
            };
        }

        case ADD_INTERVIEW: {
            const {interview} = action.payload;

            // TODO add network request

            interview.id = Date.now().toString()
            return {
                ...state,
                interviews: [...state.interviews, interview]
            };
        }

        case UPDATE_INTERVIEW: {
            const {interview} = action.payload;

            // TODO add network request

            const index = state.interviews.findIndex(item => item.id === interview.id);
            if (index >= 0) {
                state.interviews[index] = interview;
            }

            return state;
        }

        case DELETE_INTERVIEW: {
            const {interviewId} = action.payload;

            // TODO add network request

            const interviews = state.interviews.filter(item => item.id !== interviewId);
            return {
                ...state,
                interviews: interviews
            };
        }

        default:
            return state;
    }
}
