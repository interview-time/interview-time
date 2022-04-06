import { includes } from "./comparators";
import { defaultTo } from "lodash/util";
import { uniq } from "lodash/array";
import { isEmpty } from "./date";

/**
 *
 * @param {Question[]} questions
 * @param {string} textFilter
 * @returns {Question[]}
 */
export const filterQuestionText = (questions, textFilter) => {
    return defaultTo(questions, []).filter(question => includes(question.question, textFilter, true));
};

/**
 *
 * @param {Question[]} questions
 * @param {string} tagFilter
 * @returns {Question[]}
 */
export const filterQuestionTag = (questions, tagFilter) => {
    return defaultTo(questions, []).filter(question =>
        defaultTo(question.tags, []).find(tag => includes(tag, tagFilter))
    );
};

/**
 *
 * @param {Question[]} questions
 * @param {string} difficultyFilter
 * @returns {Question[]}
 */
export const filterQuestionDifficulty = (questions, difficultyFilter) => {
    return defaultTo(questions, []).filter(question => difficultyFilter === question.difficulty);
};

/**
 *
 * @param {string} inputValue
 * @param option
 * @returns {boolean}
 */
export const filterOptionLabel = (inputValue, option) => option.label.toLowerCase().includes(inputValue.toLowerCase());

/**
 *
 * @param {string} inputValue
 * @param option
 * @returns {boolean}
 */
export const filterOptionValue = (inputValue, option) => option.value.toLowerCase().includes(inputValue.toLowerCase());

/**
 *
 * @param {InterviewGroup} inputValue
 * @returns {Question[]}
 */
export const filterQuestionsWithAssessment = inputValue =>
    inputValue.questions.filter(question => question.assessment && question.assessment !== 0);

/**
 *
 * @param {InterviewGroup} inputValue
 * @returns {Question[]}
 */
export const filterQuestionsWithAssessmentNotes = inputValue =>
    inputValue.questions.filter(
        question => (question.assessment && question.assessment !== 0) || !isEmpty(question.notes)
    );

/**
 *
 * @param {InterviewGroup[]} inputValue
 * @returns {InterviewGroup[]}
 */
export const filterGroupsWithAssessment = inputValue =>
    inputValue.filter(group => filterQuestionsWithAssessment(group).length > 0);

/**
 *
 * @param {InterviewGroup[]} inputValue
 * @returns {InterviewGroup[]}
 */
export const filterGroupsWithAssessmentNotes = inputValue =>
    inputValue.filter(group => filterQuestionsWithAssessmentNotes(group).length > 0);

/**
 *
 * @param {Interview[]} interviews
 * @returns {{label: string, value: string}[]}
 */
export const interviewsPositionOptions = interviews =>
    uniq(interviews.map(interview => interview.position))
        .filter(position => !isEmpty(position) && position !== "Hello world") // bug introduced somewhere in the past
        .sort()
        .map(position => ({
            label: position,
            value: position,
        }));
