import { TemplateState } from "../state-models";
import { Template, TemplateGroup } from "../models";

export const selectTemplate = (state: TemplateState, id: string): Template | undefined =>
    state.templates.find(template => template.templateId === id);

export const selectAssessmentGroup = (template: Template): TemplateGroup => template.structure.groups[0]!;
