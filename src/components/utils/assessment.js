import { flatMap } from "lodash/collection";
import { InterviewAssessment, QuestionAssessment } from "./constants";

const COLOR_RED_5 = '#ff4d4f';
const COLOR_ORANGE_5 = '#FFA940';
const COLOR_GREEN_6 = '#52c41a';
const COLOR_GREEN_8 = '#389E0D';
const COLOR_NEUTRAL_6 = '#bfbfbf';

const QUESTION_SCORE_GOOD = 1.0
const QUESTION_SCORE_AVERAGE = 0.8
const QUESTION_SCORE_POOR = 0.2

const PERFORMANCE_SCORE_HIGHLY_SKILLED = 0.8
const PERFORMANCE_SCORE_SKILLED = 0.6
const PERFORMANCE_SCORE_LOW_SKILLS = 0.4
const PERFORMANCE_SCORE_NO_PROFICIENCY = 0.2

export const getDecisionText = (decision) => {
    if (decision === InterviewAssessment.YES) {
        return 'yes';
    } else if (decision === InterviewAssessment.STRONG_YES) {
        return 'strong yes';
    } else if (decision === InterviewAssessment.NO) {
        return 'no';
    } else if (decision === InterviewAssessment.STRONG_NO) {
        return 'strong no';
    }

    return 'none'
}

export const getDecisionColor = (decision) => {
    if (decision === InterviewAssessment.YES || decision === InterviewAssessment.STRONG_YES) {
        return COLOR_GREEN_6;
    } else if (decision === InterviewAssessment.NO || decision === InterviewAssessment.STRONG_NO) {
        return COLOR_RED_5;
    }

    return COLOR_NEUTRAL_6
}

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {Question[]}
 */
export const getQuestionsWithAssessment = (groups) => {
    return flatMap(groups, (item) => item.questions)
        .filter(question => question.assessment !== 0)
}

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {string}
 */
export const getOverallPerformanceColor = (groups) => {
    let performance = getOverallPerformanceNumber(groups)
    if (performance >= PERFORMANCE_SCORE_HIGHLY_SKILLED) {
        return COLOR_GREEN_8;
    } else if (performance >= PERFORMANCE_SCORE_SKILLED) {
        return COLOR_GREEN_6;
    } else if (performance >= PERFORMANCE_SCORE_LOW_SKILLS) {
        return COLOR_ORANGE_5;
    } else if (performance >= PERFORMANCE_SCORE_NO_PROFICIENCY) {
        return COLOR_RED_5;
    }
    return COLOR_NEUTRAL_6
}

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {number} - [0, 1.0]
 */
export const getOverallPerformancePercent = (groups) => {
    let performance = getOverallPerformanceNumber(groups);
    return performance > 0 ? Math.round(performance * 100) : 0;
}

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns number} - [0, 1.0]
 */
export const getOverallPerformanceNumber = (groups) => {
    let total = 0;
    groups.forEach(group => {
        total += getGroupAssessmentNumber(group)
    })
    return groups.length > 0 ? total / groups.length : 0;
}

/**
 *
 * @param {InterviewGroup} group
 * @returns {string}
 */
export const getGroupAssessmentColor = (group) => {
    let assessment = getGroupAssessmentNumber(group)
    if (assessment >= PERFORMANCE_SCORE_HIGHLY_SKILLED) {
        return COLOR_GREEN_8;
    } else if (assessment >= PERFORMANCE_SCORE_SKILLED) {
        return COLOR_GREEN_6;
    } else if (assessment >= PERFORMANCE_SCORE_LOW_SKILLS) {
        return COLOR_ORANGE_5;
    } else if (assessment >= PERFORMANCE_SCORE_NO_PROFICIENCY) {
        return COLOR_RED_5;
    }
    return COLOR_NEUTRAL_6
}

/**
 *
 * @param {InterviewGroup} group
 * @returns {string}
 */
export const getGroupAssessmentText = (group) => {
    const assessment = getGroupAssessmentNumber(group);
    if (assessment >= PERFORMANCE_SCORE_HIGHLY_SKILLED) {
        return "highly skilled";
    } else if (assessment >= PERFORMANCE_SCORE_SKILLED) {
        return "skilled";
    } else if (assessment >= PERFORMANCE_SCORE_LOW_SKILLS) {
        return "low skills";
    } else if (assessment >= PERFORMANCE_SCORE_NO_PROFICIENCY) {
        return "no proficiency";
    }
    return "no data"
}

/**
 *
 * @param {InterviewGroup} group
 * @returns {number} - [0, 100]
 */
export const getGroupAssessmentPercent = (group) => {
    let assessment = getGroupAssessmentNumber(group)
    return assessment > 0 ? Math.round(assessment * 100) : 0;
}

/**
 *
 * @param {InterviewGroup} group
 * @returns {number} - [0, 1.0]
 */
export const getGroupAssessmentNumber = (group) => {
    let questions = group.questions.filter(question => question.assessment !== 0)
    let total = 0;
    questions.forEach(question => {
        total += getQuestionAssessmentNumber(question.assessment)
    })

    return questions.length > 0 ? total / questions.length : 0;
}

/**
 *
 * @returns {number} - [0, 1.0]
 */
const getQuestionAssessmentNumber = (assessment) => {
    if(assessment === QuestionAssessment.YES) {
        return QUESTION_SCORE_GOOD;
    } else if (assessment === QuestionAssessment.MAYBE) {
        return QUESTION_SCORE_AVERAGE;
    } else if (assessment === QuestionAssessment.NO) {
        return QUESTION_SCORE_POOR;
    }

    return 0;
}