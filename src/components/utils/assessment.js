import { flatMap } from "lodash/collection";
import { Difficulty, InterviewAssessment, QuestionAssessment } from "./constants";
import { defaultTo } from "lodash/util";

const COLOR_RED_5 = '#ff4d4f';
const COLOR_NEUTRAL_6 = '#bfbfbf';
const COLOR_MAIN = '#8C2BE3';

const COLOR_GREEN_DARK = '#16A34A'
const COLOR_ORANGE_DARK = '#FFA940'

const COLOR_GREEN_LIGHT = '#22C55E'
const COLOR_ORANGE_LIGHT = '#FFC300'

const Score = {
    MAX: 100,
    HIGHLY_SKILLED: 80,
    SKILLED: 60,
    LOW_SKILLS: 40,
}

const DifficultyWeight = {
    EASY: 1.0,
    MEDIUM: 1.5,
    HARD: 2.0
};

const QuestionAssessmentWeight = {
    POOR: 0.4,
    GOOD: 0.8,
    EXCELLENT: 1.0
};

export const getDecisionText = (decision) => {
    if (decision === InterviewAssessment.YES) {
        return 'Yes';
    } else if (decision === InterviewAssessment.STRONG_YES) {
        return 'Strong Yes';
    } else if (decision === InterviewAssessment.NO) {
        return 'No';
    } else if (decision === InterviewAssessment.STRONG_NO) {
        return 'Strong No';
    }

    return 'No Decision'
}

export const getDecisionColor = (decision) => {
    if (decision === InterviewAssessment.YES || decision === InterviewAssessment.STRONG_YES) {
        return COLOR_GREEN_LIGHT;
    } else if (decision === InterviewAssessment.NO || decision === InterviewAssessment.STRONG_NO) {
        return COLOR_RED_5;
    }

    return COLOR_MAIN
}

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {string}
 */
export const getOverallPerformanceColor = (groups) => {
    let performance = getOverallPerformancePercent(groups)
    if (performance >= Score.HIGHLY_SKILLED) {
        return COLOR_GREEN_DARK;
    } else if (performance >= Score.SKILLED) {
        return COLOR_ORANGE_DARK;
    } else if (performance >= Score.LOW_SKILLS) {
        return COLOR_RED_5;
    }
    return COLOR_NEUTRAL_6
}

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {number} - [0, 100]
 */
export const getOverallPerformancePercent = (groups) => {
    let totalScore = 0;
    let totalGroupsWithAssessment = 0;
    groups.forEach(group => {
        const groupAssessmentNumber = getQuestionsAssessment(group.questions);
        if (groupAssessmentNumber > 0) {
            totalScore += groupAssessmentNumber;
            totalGroupsWithAssessment++;
        }
    })
    return totalGroupsWithAssessment > 0 ? Math.round(totalScore / totalGroupsWithAssessment) : 0;
}

/**
 *
 * @param {InterviewGroup[]} groups
 * @returns {Question[]}
 */
export const getQuestionsWithAssessment = (groups) => {
    return flatMap(groups, (item) => item.questions).filter(question => hasAssessment(question))
}

/**
 *
 * @param {number} score
 * @returns {string}
 */
export const getGroupAssessmentEmoji = (score) => {
    let emojiTotal = 10
    let emojiColorIndex = Math.round(score / emojiTotal)

    let emojiColor = "⬛";
    if (score >= Score.HIGHLY_SKILLED) {
        emojiColor = "🟩";
    } else if (score >= Score.SKILLED) {
        emojiColor = "🟨";
    } else if (score >= Score.LOW_SKILLS) {
        emojiColor = "🟥";
    }

    let progress = ""
    for (let i = 0; i < emojiTotal; i++) {
        progress += i < emojiColorIndex ? emojiColor : "⬛️";
    }
    return progress;
}

/**
 * @typedef {Object} GroupAssessment
 * @property {number} score
 * @property {string} text
 * @property {string} color
 */

/**
 *
 * @param {Question[]} questions
 * @returns {GroupAssessment}
 */
export const getGroupAssessment = (questions) => {
    let score = getQuestionsAssessment(defaultTo(questions, []))
    return {
        score: score,
        text: getGroupAssessmentText(score),
        color: getGroupAssessmentColor(score)
    }
}

/**
 *
 * @param {number} score
 * @returns {string}
 */
const getGroupAssessmentText = (score) => {
    if (score >= Score.HIGHLY_SKILLED) {
        return "highly skilled";
    } else if (score >= Score.SKILLED) {
        return "skilled";
    } else if (score >= Score.LOW_SKILLS) {
        return "low skills";
    }
    return "no data"
}

/**
 *
 * @param {number} score
 * @returns {string}
 */
const getGroupAssessmentColor = (score) => {
    if (score >= Score.HIGHLY_SKILLED) {
        return COLOR_GREEN_LIGHT;
    } else if (score >= Score.SKILLED) {
        return COLOR_ORANGE_LIGHT;
    } else if (score >= Score.LOW_SKILLS) {
        return COLOR_RED_5;
    }
    return COLOR_NEUTRAL_6
}

/**
 * @param {Question[]} questions
 * @returns {number} - [0, 100]
 */
export const getQuestionsAssessment = (questions) => {
    // handle case when questions difficulty is not set
    let allQuestions = questions.filter(question => hasAssessment(question)).map(question => {
        if (!question.difficulty || question.difficulty === "") {
            question.difficulty = Difficulty.DEFAULT
        }
        return question
    })

    // log(`Total questions: ${allQuestions.length}`);

    let easyQuestions = allQuestions.filter(question => question.difficulty === Difficulty.EASY)
    let mediumQuestions = allQuestions.filter(question => question.difficulty === Difficulty.MEDIUM);
    let hardQuestions = allQuestions.filter(question => question.difficulty === Difficulty.HARD);

    let totalQuestions =
        (easyQuestions.length * DifficultyWeight.EASY) +
        (mediumQuestions.length * DifficultyWeight.MEDIUM) +
        (hardQuestions.length * DifficultyWeight.HARD)
    // log(`Total questions in easy scale: ${totalQuestions}`);

    let scorePerQuestion = Score.MAX / totalQuestions;
    // log(`Score per easy question: ${scorePerQuestion.toFixed(1)}`);

    // log("===========================");
    let maxEasyScore = scorePerQuestion * DifficultyWeight.EASY * easyQuestions.length;
    // log(`Total max easy score: ${maxEasyScore.toFixed(1)}`);

    let maxMediumScore = scorePerQuestion * DifficultyWeight.MEDIUM * mediumQuestions.length;
    // log(`Total max medium score: ${maxMediumScore.toFixed(1)}`);

    let maxHardScore = scorePerQuestion * DifficultyWeight.HARD * hardQuestions.length;
    // log(`Total max hard score: ${maxHardScore.toFixed(1)}`);

    // log("===========================");
    let candidateScore = 0;

    let maxEasyQuestionScore = maxEasyScore / easyQuestions.length;
    easyQuestions.forEach(question => {
        candidateScore += getQuestionAssessmentWeight(question.assessment) * maxEasyQuestionScore;
    });

    let maxMediumQuestionScore = maxMediumScore / mediumQuestions.length;
    mediumQuestions.forEach(question => {
        candidateScore += getQuestionAssessmentWeight(question.assessment) * maxMediumQuestionScore;
    });

    let maxHardQuestionScore = maxHardScore / hardQuestions.length;
    hardQuestions.forEach(question => {
        candidateScore += getQuestionAssessmentWeight(question.assessment) * maxHardQuestionScore;
    });

    // log("===========================");
    // log(`Candidate score: ${Math.round(candidateScore)}`);

    return Math.round(candidateScore);
}

/**
 *
 * @param {number} assessment
 * @returns {number}
 */
const getQuestionAssessmentWeight = assessment => {
    switch (assessment) {
        case QuestionAssessment.POOR:
            return QuestionAssessmentWeight.POOR;
        case QuestionAssessment.GOOD:
            return QuestionAssessmentWeight.GOOD;
        case QuestionAssessment.EXCELLENT:
            return QuestionAssessmentWeight.EXCELLENT;
        default:
            return 0;
    }
};

/**
 *
 * @param {Question} question
 * @returns {boolean}
 */
const hasAssessment = question => question.assessment && question.assessment !== 0;
