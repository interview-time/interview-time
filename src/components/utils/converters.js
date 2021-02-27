/**
 *
 * @param {String} id
 * @param {[*]} questions
 * @returns {*}
 */
export function findQuestion(id, questions) {
    return questions.find(question => question.questionId === id)
}

/**
 *
 * @param {String} id
 * @param {[*]} interviews
 * @returns {*}
 */
export function findInterview(id, interviews) {
    return interviews.find(interview => interview.interviewId === id)
}

/**
 *
 * @param {String} id
 * @param {[*]} guides
 * @returns {*}
 */
export function findGuide(id, guides) {
    return guides.find(guide => guide.guideId === id);
}

/**
 *
 * @param {[String]} questionIds
 * @param {[*]} questions
 * @returns {[]}
 */
export function questionIdsToQuestions(questionIds, questions) {
    return questionIds.map(id => findQuestion(id, questions))
}

/**
 *
 * @param {[*]} questions
 * @returns {[String]}
 */
export function questionsToQuestionIds(questions) {
    return questions.map(question => question.questionId)
}