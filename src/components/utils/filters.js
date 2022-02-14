import { includes } from "./comparators";
import { defaultTo } from "lodash/util";

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
 * @param {InterviewGroup[]} inputValue
 * @returns {InterviewGroup[]}
 */
export const filterGroupsWithAssessment = inputValue =>
    inputValue.filter(group => filterQuestionsWithAssessment(group).length > 0);
