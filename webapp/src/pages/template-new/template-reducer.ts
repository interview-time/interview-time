import { InterviewChecklist, Template, TemplateChallenge, TemplateGroup, TemplateQuestion } from "../../store/models";
import { cloneDeep, remove } from "lodash";
import { arrayMoveMutable } from "array-move";

export enum ReducerActionType {
    SET_TEMPLATE,
    UPDATE_TITLE,
    UPDATE_HEADER,
    UPDATE_DESCRIPTION,
    ADD_QUESTION,
    REMOVE_QUESTION,
    UPDATE_QUESTION,
    MOVE_QUESTION,
    ADD_GROUP,
    REMOVE_GROUP,
    UPDATE_GROUP,
    MOVE_GROUP,
    ADD_CHALLENGE,
    UPDATE_CHALLENGE,
    REMOVE_CHALLENGE,
    MOVE_CHALLENGE,
    ADD_CHECKLIST,
    UPDATE_CHECKLIST,
    REMOVE_CHECKLIST,
}

export type SetStateAction = {
    type: ReducerActionType.SET_TEMPLATE;
    template: Template;
};

export type UpdateTitleAction = {
    type: ReducerActionType.UPDATE_TITLE;
    title: string;
};

export type UpdateDescriptionAction = {
    type: ReducerActionType.UPDATE_DESCRIPTION;
    description: string;
};

export type UpdateHeaderAction = {
    type: ReducerActionType.UPDATE_HEADER;
    header: string;
};

export type AddQuestionAction = {
    type: ReducerActionType.ADD_QUESTION;
    groupId: string;
    question: TemplateQuestion;
};

export type RemoveQuestionAction = {
    type: ReducerActionType.REMOVE_QUESTION;
    groupId: string;
    questionId: string;
};

export type UpdateQuestionAction = {
    type: ReducerActionType.UPDATE_QUESTION;
    name: string;
    questionId: string;
    groupId: string;
};

export type MoveQuestionAction = {
    type: ReducerActionType.MOVE_QUESTION;
    groupId: string;
    oldIndex: number;
    newIndex: number;
};

export type AddGroupAction = {
    type: ReducerActionType.ADD_GROUP;
    group: TemplateGroup;
};

export type RemoveGroupAction = {
    type: ReducerActionType.REMOVE_GROUP;
    groupId: string;
};

export type UpdateGroupAction = {
    type: ReducerActionType.UPDATE_GROUP;
    groupId: string;
    name: string;
};

export type MoveGroupAction = {
    type: ReducerActionType.MOVE_GROUP;
    oldIndex: number;
    newIndex: number;
};
export type AddChallengeAction = {
    type: ReducerActionType.ADD_CHALLENGE;
    challenge: TemplateChallenge;
};

export type UpdateChallengeAction = {
    type: ReducerActionType.UPDATE_CHALLENGE;
    challenge: TemplateChallenge;
    mutateState: boolean;
};

export type RemoveChallengeAction = {
    type: ReducerActionType.REMOVE_CHALLENGE;
    challenge: TemplateChallenge;
};

export type MoveChallengeAction = {
    type: ReducerActionType.MOVE_CHALLENGE;
    oldIndex: number;
    newIndex: number;
};

export type AddChecklistAction = {
    type: ReducerActionType.ADD_CHECKLIST;
    checklist: InterviewChecklist;
};

export type UpdateChecklistAction = {
    type: ReducerActionType.UPDATE_CHECKLIST;
    checklist: InterviewChecklist;
    checklistIndex: number;
};

export type RemoveChecklistAction = {
    type: ReducerActionType.REMOVE_CHECKLIST;
    checklistIndex: number;
};

export type ReducerAction =
    | SetStateAction
    | UpdateTitleAction
    | UpdateDescriptionAction
    | AddQuestionAction
    | RemoveQuestionAction
    | UpdateQuestionAction
    | MoveQuestionAction
    | AddGroupAction
    | RemoveGroupAction
    | UpdateGroupAction
    | MoveGroupAction
    | UpdateHeaderAction
    | AddChallengeAction
    | UpdateChallengeAction
    | RemoveChallengeAction
    | MoveChallengeAction
    | AddChecklistAction
    | UpdateChecklistAction
    | RemoveChecklistAction;

export const templateReducer = (state: Template, action: ReducerAction): Template => {
    switch (action.type) {
        case ReducerActionType.SET_TEMPLATE:
            return action.template;
        case ReducerActionType.UPDATE_TITLE:
            state.title = action.title;
            return state;
        case ReducerActionType.UPDATE_DESCRIPTION:
            state.description = action.description;
            return state;
        case ReducerActionType.UPDATE_HEADER:
            state.structure.header = action.header;
            return state;
        case ReducerActionType.ADD_QUESTION: {
            const newState = cloneDeep(state);
            findGroup(newState.structure.groups, action.groupId, group => group.questions.push(action.question));
            return newState;
        }
        case ReducerActionType.REMOVE_QUESTION: {
            const newState = cloneDeep(state);
            findGroup(
                newState.structure.groups,
                action.groupId,
                group =>
                    (group.questions = group.questions.filter(question => question.questionId !== action.questionId))
            );
            return newState;
        }
        case ReducerActionType.UPDATE_QUESTION: {
            const newState = cloneDeep(state);
            findGroup(newState.structure.groups, action.groupId, group => {
                const question = group.questions.find(question => question.questionId === action.questionId);
                if (question) {
                    question.question = action.name;
                }
            });
            return newState;
        }
        case ReducerActionType.MOVE_QUESTION: {
            const newState = cloneDeep(state);
            findGroup(newState.structure.groups, action.groupId, group =>
                arrayMoveMutable(group.questions, action.oldIndex, action.newIndex)
            );

            return newState;
        }
        case ReducerActionType.ADD_GROUP: {
            const newState = cloneDeep(state);
            newState.structure.groups.push(action.group);

            return newState;
        }
        case ReducerActionType.REMOVE_GROUP: {
            const newState = cloneDeep(state);
            newState.structure.groups = newState.structure.groups.filter(g => g.groupId !== action.groupId);

            return newState;
        }
        case ReducerActionType.UPDATE_GROUP: {
            const newState = cloneDeep(state);
            findGroup(newState.structure.groups, action.groupId, group => (group.name = action.name));

            return newState;
        }
        case ReducerActionType.MOVE_GROUP: {
            const newState = cloneDeep(state);
            arrayMoveMutable(newState.structure.groups, action.oldIndex, action.newIndex);

            return newState;
        }
        case ReducerActionType.ADD_CHALLENGE: {
            const newState = cloneDeep(state);
            if (newState.challenges) {
                newState.challenges.push(action.challenge);
            } else {
                newState.challenges = [action.challenge];
            }
            return newState;
        }
        case ReducerActionType.UPDATE_CHALLENGE: {
            if (action.mutateState) {
                // performance optimization, when input fields are changed it's costly to re-render every time
                let challenge = state.challenges?.find(
                    challenge => challenge.challengeId === action.challenge.challengeId
                );
                if (challenge) {
                    challenge.name = action.challenge.name;
                    challenge.description = action.challenge.description;
                    challenge.gitHubUrl = action.challenge.gitHubUrl;
                    challenge.fileName = action.challenge.fileName;
                }
                return state;
            } else {
                let newState = cloneDeep(state);

                if (newState.challenges) {
                    const index = newState.challenges.findIndex(
                        challenge => challenge.challengeId === action.challenge.challengeId
                    );
                    if (index >= 0) {
                        newState.challenges[index] = action.challenge;
                    }
                }
                return newState;
            }
        }
        case ReducerActionType.REMOVE_CHALLENGE: {
            const newState = cloneDeep(state);
            if (newState.challenges) {
                newState.challenges = newState.challenges?.filter(
                    challenge => challenge.challengeId !== action.challenge.challengeId
                );
            }

            return newState;
        }
        case ReducerActionType.MOVE_CHALLENGE: {
            const newState = cloneDeep(state);
            if (newState.challenges) {
                arrayMoveMutable(newState.challenges, action.oldIndex, action.newIndex);
            }

            return newState;
        }
        case ReducerActionType.ADD_CHECKLIST: {
            const newState = cloneDeep(state);
            newState.checklist = (newState.checklist || []).concat(action.checklist);
            console.log(newState.checklist);

            return newState;
        }
        case ReducerActionType.REMOVE_CHECKLIST: {
            const newState = cloneDeep(state);
            remove((newState.checklist || []), (_, index) => index === action.checklistIndex);

            return newState;
        }
        case ReducerActionType.UPDATE_CHECKLIST: {
            // state mutation
            const checklistItem = state.checklist?.find((_, index) => index === action.checklistIndex);
            if (checklistItem) {
                checklistItem.item = action.checklist.item;
                checklistItem.checked = action.checklist.checked;
            }

            return state;
        }
        default:
            return state;
    }
};

const findGroup = (groups: TemplateGroup[], groupId: string, operation: (group: TemplateGroup) => void) => {
    const group = groups.find(group => group.groupId === groupId);
    if (group) operation(group);
};
