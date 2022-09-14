import { InterviewType, LibraryTemplate, Template } from "../../store/models";

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
            templateId: "",
            parentId: parent.libraryId,
            interviewType: InterviewType.INTERVIEW,
        };
    }
};

export const newTemplateFromType = (template: Template, type: InterviewType): Template | undefined => {
    if (type === InterviewType.INTERVIEW) {
        return {
            ...template,
            interviewType: InterviewType.INTERVIEW,
            challenges: [],
            structure: {
                ...template.structure,
                groups: [],
            },
        };
    } else if (type === InterviewType.LIVE_CODING) {
        return {
            ...template,
            interviewType: type,
            structure: {
                ...template.structure,
                groups: [
                    {
                        groupId: Date.now().toString(),
                        name: "Assessment",
                        questions: [],
                    },
                ],
            },
        };
    }
};
