import { sortBy } from "lodash";
import { RootState, TemplateState } from "../state-models";
import { Template, TemplateChallenge, TemplateGroup } from "../models";

export const selectTemplate = (state: TemplateState, id: string): Template | undefined =>
    state.templates.find(template => template.templateId === id);

export const selectAssessmentGroup = (template: Template): TemplateGroup => template.structure.groups[0]!;

export const selectTakeHomeAssignment = (template: Template): TemplateChallenge => template.challenges?.[0]!;

export const selectTemplates = (state: RootState) => state.templates.templates;

export const selectRecentTemplates = (state: RootState) => sortBy(state.templates.templates, ["title"]).slice(0, 3);
