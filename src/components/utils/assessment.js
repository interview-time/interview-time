import { flatMap } from "lodash/collection";
import { InterviewAssessment, QuestionAssessment } from "./constants";

const COLOR_RED_5 = '#ff4d4f';
const COLOR_GREEN_6 = '#52c41a';
const COLOR_NEUTRAL_6 = '#bfbfbf';

const COLOR_GREEN_DARK = '#16A34A'
const COLOR_ORANGE_DARK = '#FFA940'

const COLOR_GREEN_LIGHT = '#22C55E'
const COLOR_ORANGE_LIGHT = '#FFC300'

const QUESTION_SCORE_GOOD = 1.0
const QUESTION_SCORE_AVERAGE = 0.80
const QUESTION_SCORE_POOR = 0.4

const PERFORMANCE_SCORE_HIGHLY_SKILLED = 0.9
const PERFORMANCE_SCORE_SKILLED = 0.6
const PERFORMANCE_SCORE_LOW_SKILLS = 0.4

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
        return COLOR_GREEN_DARK;
    } else if (performance >= PERFORMANCE_SCORE_SKILLED) {
        return COLOR_ORANGE_DARK;
    } else if (performance >= PERFORMANCE_SCORE_LOW_SKILLS) {
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
    let totalScore = 0;
    let totalGroupsWithAssessment = 0;
    groups.forEach(group => {
        const groupAssessmentNumber = getGroupAssessmentNumber(group);
        if (groupAssessmentNumber > 0) {
            totalScore += groupAssessmentNumber;
            totalGroupsWithAssessment++;
        }
    })
    return totalGroupsWithAssessment > 0 ? totalScore / totalGroupsWithAssessment : 0;
}

/**
 *
 * @param {InterviewGroup} group
 * @returns {string}
 */
export const getGroupAssessmentColor = (group) => {
    let assessment = getGroupAssessmentNumber(group)
    if (assessment >= PERFORMANCE_SCORE_HIGHLY_SKILLED) {
        return COLOR_GREEN_LIGHT;
    } else if (assessment >= PERFORMANCE_SCORE_SKILLED) {
        return COLOR_ORANGE_LIGHT;
    } else if (assessment >= PERFORMANCE_SCORE_LOW_SKILLS) {
        return COLOR_RED_5;
    }
    return COLOR_NEUTRAL_6
}

/**
 *
 * @param {InterviewGroup} group
 * @returns {string}
 */
export const getGroupAssessmentEmoji = (group) => {
    let assessment = getGroupAssessmentNumber(group);
    let emojiTotal = 10
    let emojiColorIndex = Math.round(assessment * emojiTotal)
    let emojiColor = "⬛";
    if (assessment >= PERFORMANCE_SCORE_HIGHLY_SKILLED) {
        emojiColor = "🟩";
    } else if (assessment >= PERFORMANCE_SCORE_SKILLED) {
        emojiColor = "🟨";
    } else if (assessment >= PERFORMANCE_SCORE_LOW_SKILLS) {
        emojiColor = "🟥";
    }

    let progress = ""
    for (let i = 0; i < emojiTotal; i++) {
        progress += i < emojiColorIndex ? emojiColor : "⬛️";
    }
    return progress;
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
    if(assessment === QuestionAssessment.GOOD) {
        return QUESTION_SCORE_GOOD;
    } else if (assessment === QuestionAssessment.AVERAGE) {
        return QUESTION_SCORE_AVERAGE;
    } else if (assessment === QuestionAssessment.POOR) {
        return QUESTION_SCORE_POOR;
    }

    return 0;
}