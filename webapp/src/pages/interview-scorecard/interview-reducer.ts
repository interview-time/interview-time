import {
    ChallengeDetails,
    Interview,
    InterviewAssessment,
    InterviewQuestion,
    InterviewStatus,
    InterviewStructureGroup,
    QuestionAssessment,
    RedFlag,
    Template,
    TemplateGroup,
} from "../../store/models";
import { cloneDeep, remove } from "lodash";
import { v4 as uuidv4 } from "uuid";

export enum ReducerActionType {
    SET_INTERVIEW = "SET_INTERVIEW",
    UPDATE_NOTES = "UPDATE_NOTES",
    SET_RED_FLAGS = "SET_RED_FLAGS",
    UPDATE_QUESTION_NOTES = "UPDATE_QUESTION_NOTES",
    UPDATE_QUESTION_ASSESSMENT = "UPDATE_QUESTION_ASSESSMENT",
    ADD_QUESTIONS = "ADD_QUESTIONS",
    REMOVE_QUESTIONS = "REMOVE_QUESTIONS",
    UPDATE_STATUS = "UPDATE_STATUS",
    UPDATE_CHECKLIST_ITEM = "UPDATE_CHECKLIST_ITEM",
    UPDATE_ASSESSMENT = "UPDATE_ASSESSMENT",
    UPDATE_SELECTED_LIVE_CODING_CHALLENGE = "UPDATE_SELECTED_LIVE_CODING_CHALLENGE",
}

export type SetInterviewAction = {
    type: ReducerActionType.SET_INTERVIEW;
    interview: Interview;
};

export type UpdateNotesAction = {
    type: ReducerActionType.UPDATE_NOTES;
    notes: string;
};

export type SetRedFLagsAction = {
    type: ReducerActionType.SET_RED_FLAGS;
    redFlags: RedFlag[];
};

export type UpdateQuestionNotesAction = {
    type: ReducerActionType.UPDATE_QUESTION_NOTES;
    questionId: string;
    notes: string;
};

export type UpdateQuestionAssessmentAction = {
    type: ReducerActionType.UPDATE_QUESTION_ASSESSMENT;
    questionId: string;
    assessment: QuestionAssessment;
};

export type AddQuestionsAction = {
    type: ReducerActionType.ADD_QUESTIONS;
    template: Template;
};

export type RemoveQuestionsAction = {
    type: ReducerActionType.REMOVE_QUESTIONS;
    groupId: string;
};

export type UpdateStatusAction = {
    type: ReducerActionType.UPDATE_STATUS;
    status: InterviewStatus;
};

export type UpdateAssessmentAction = {
    type: ReducerActionType.UPDATE_ASSESSMENT;
    assessment: InterviewAssessment;
};

export type UpdateChallengeAction = {
    type: ReducerActionType.UPDATE_SELECTED_LIVE_CODING_CHALLENGE;
    challengeId: string;
    selected: boolean;
};

export type UpdateChecklistItemAction = {
    type: ReducerActionType.UPDATE_CHECKLIST_ITEM;
    index: number;
    checked: boolean;
};

export type ReducerAction =
    | SetInterviewAction
    | UpdateNotesAction
    | SetRedFLagsAction
    | UpdateQuestionNotesAction
    | UpdateQuestionAssessmentAction
    | AddQuestionsAction
    | RemoveQuestionsAction
    | UpdateStatusAction
    | UpdateAssessmentAction
    | UpdateChallengeAction
    | UpdateChecklistItemAction;

export const interviewReducer = (state: Interview, action: ReducerAction): Interview => {
    switch (action.type) {
        case ReducerActionType.SET_INTERVIEW:
            return action.interview;
        case ReducerActionType.UPDATE_NOTES:
            return {
                ...state,
                notes: action.notes,
            };
        case ReducerActionType.SET_RED_FLAGS:
            return {
                ...state,
                redFlags: action.redFlags,
            };
        case ReducerActionType.UPDATE_QUESTION_NOTES: {
            const newState = cloneDeep(state);
            findQuestion(newState.structure.groups || [], action.questionId, question => {
                question.notes = action.notes;
            });
            return newState;
        }
        case ReducerActionType.UPDATE_QUESTION_ASSESSMENT: {
            const newState = cloneDeep(state);
            findQuestion(newState.structure.groups || [], action.questionId, question => {
                question.assessment = action.assessment;
            });
            return newState;
        }
        case ReducerActionType.ADD_QUESTIONS: {
            const groups: InterviewStructureGroup[] = action.template.structure.groups.map((group: TemplateGroup) => {
                const interviewGroup = toInterviewGroup(group);
                interviewGroup.name = `${action.template.title} - ${interviewGroup.name}`;
                return interviewGroup;
            });

            const newState = cloneDeep(state);
            newState.structure.groups.push(...groups);

            return newState;
        }
        case ReducerActionType.REMOVE_QUESTIONS: {
            const newState = cloneDeep(state);
            remove(newState.structure.groups, group => group.groupId === action.groupId);
            return newState;
        }
        case ReducerActionType.UPDATE_STATUS: {
            return {
                ...state,
                status: action.status,
            };
        }
        case ReducerActionType.UPDATE_ASSESSMENT: {
            return {
                ...state,
                decision: action.assessment,
            };
        }
        case ReducerActionType.UPDATE_SELECTED_LIVE_CODING_CHALLENGE: {
            const newState = cloneDeep(state);
            const liveCodingChallenges = newState.liveCodingChallenges || [];
            const challenge = liveCodingChallenges.find(
                (challenge: ChallengeDetails) => challenge.challengeId === action.challengeId
            );
            if (challenge) {
                challenge.selected = action.selected;
            }

            return newState;
        }
        case ReducerActionType.UPDATE_CHECKLIST_ITEM: {
            const newState = cloneDeep(state);
            if (newState.checklist) {
                newState.checklist[action.index].checked = action.checked;
            }

            return newState;
        }
        default:
            return state;
    }
};

const toInterviewGroup = (templateGroup: TemplateGroup): InterviewStructureGroup => ({
    groupId: uuidv4(),
    name: templateGroup.name,
    questions: templateGroup.questions.map(question => ({
        questionId: question.questionId,
        question: question.question,
        difficulty: question.difficulty,
        tags: question.tags,
        assessment: QuestionAssessment.NO_ASSESSMENT,
        notes: "",
    })),
});

const findQuestion = (
    groups: InterviewStructureGroup[],
    questionId: string,
    operation: (group: InterviewQuestion) => void
) => {
    for (const group of groups) {
        for (const question of group.questions || []) {
            if (question.questionId === questionId) {
                operation(question);
                return;
            }
        }
    }
};
