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