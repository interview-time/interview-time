import { TemplateState } from "../state-models";
import { Template, TemplateChallenge, TemplateGroup } from "../models";

export const selectTemplate = (state: TemplateState, id: string): Template | undefined =>
    state.templates.find(template => template.templateId === id);

export const selectAssessmentGroup = (template: Template): TemplateGroup => template.structure.groups[0]!;

export const selectTakeHomeAssignment = (template: Template): TemplateChallenge => template.challenges?.[0]!;
