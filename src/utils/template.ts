import { v4 as uuidv4 } from "uuid";
import { InterviewType, LibraryTemplate, Template } from "../store/models";
import { INTERVIEW_LIVE_CODING, INTERVIEW_QA, INTERVIEW_TAKE_HOME_TASK } from "./interview";

// @ts-ignore
export const emptyTemplate = (templateId: string): Template => ({
    templateId: templateId,
    title: "",
    interviewType: InterviewType.INTERVIEW,
    structure: {
        header: "",
        groups: [],
        footer: "",
    },
});

export const cloneLibraryTemplate = (templates: LibraryTemplate[], libraryTemplateId: string): Template | undefined => {
    let parent = templates.find(template => template.libraryId === libraryTemplateId);
    if (parent) {
        // @ts-ignore
        return {
            ...parent,
            templateId: uuidv4(),
            parentId: parent.libraryId,
            interviewType: InterviewType.INTERVIEW,
        };
    }
};

export const cloneSharedTemplate = (template: Template): Template => ({
    ...template,
    templateId: uuidv4(),
});

export const newTemplateFromType = (template: Template, type: InterviewType): Template | undefined => {
    if (type === InterviewType.INTERVIEW) {
        return {
            ...template,
            interviewType: InterviewType.INTERVIEW,
            structure: {
                ...template.structure,
                groups: [],
            },
            challenges: [],
        };
    } else if (type === InterviewType.LIVE_CODING) {
        return {
            ...template,
            interviewType: type,
            structure: {
                ...template.structure,
                groups: [
                    {
                        groupId: uuidv4(),
                        name: "Assessment",
                        questions: [],
                    },
                ],
            },
            challenges: []
        };
    } else if (type === InterviewType.TAKE_HOME_TASK) {
        return {
            ...template,
            interviewType: type,
            structure: {
                ...template.structure,
                groups: [
                    {
                        groupId: uuidv4(),
                        name: "Assessment",
                        questions: [],
                    },
                ],
            },
            challenges: [
                {
                    challengeId: uuidv4(),
                    name: "",
                },
            ],
        };
    }
};

export const interviewTypeToName = (type: InterviewType): string => {
    switch (type) {
        case InterviewType.INTERVIEW:
            return INTERVIEW_QA;
        case InterviewType.LIVE_CODING:
            return INTERVIEW_LIVE_CODING;
        case InterviewType.TAKE_HOME_TASK:
            return INTERVIEW_TAKE_HOME_TASK;
    }
}
