/**
 *
 * @param {String} id
 * @param {Question[]} questions
 * @returns {*}
 */
export function findQuestion(id, questions) {
    return questions.find(question => question.questionId === id)
}
/**
 *
 * @param {String} id
 * @param {[CategoryHolder]} categories
 * @returns {CategoryHolder}
 */
export function findCategory(id, categories) {
    return categories.find(item => item.category.categoryId === id)
}

/**
 *
 * @param {String} id
 * @param {[Interview]} interviews
 * @returns {Interview}
 */
export function findInterview(id, interviews) {
    return interviews.find(interview => interview.interviewId === id)
}

/**
 *
 * @param {String} id
 * @param {[Template]} templates
 * @returns {Template}
 */
export function findTemplate(id, templates) {
    return templates.find(template => template.guideId === id)
}

/**
 *
 * @param {String} id
 * @param {Template[]} guides
 * @returns {*}
 */
export function findGuide(id, guides) {
    return guides.find(guide => guide.guideId === id);
}

/**
 *
 * @param {String} id
 * @param {InterviewGroup[]} groups
 * @returns {InterviewGroup}
 */
export function findGroup(id, groups) {
    return groups.find(group => group.groupId === id);
}

/**
 *
 * @param {String} id
 * @param {InterviewGroup[]} groups
 * @returns {Question}
 */
export function findQuestionInGroups(id, groups) {
    for (let group of groups) {
        let question = findQuestion(id, group.questions)
        if(question) {
            return question
        }
    }
}

/**
 *
 * @param {String} id
 * @param {CategoryHolder[]} categories
 * @returns {Question}
 */
export function findQuestionInCategories(id, categories) {
    for (let category of categories) {
        let question = findQuestion(id, category.questions)
        if(question) {
            return question
        }
    }
}

/**
 *
 * @param {(InterviewGroup||TemplateGroup)} group
 * @param {CategoryHolder[]} categories
 * @returns {Question[]}
 */
export function findInterviewGroupQuestions(group, categories) {
    return group.questions.map(q => q.questionId)
        .map(id => findQuestionInCategories(id, categories))
}

/**
 *
 * @param {Question[]} questions
 * @returns {TemplateQuestion[]}
 */
export function questionsToQuestionIds(questions) {
    return questions.map(question => ({
        questionId: question.questionId
    }))
}

/**
 *
 * @param {[*]} questions
 * @returns {[String]}
 */
export function questionsToTags(questions) {
    let tags = new Set()
    questions.forEach(item => {
        if (item.tags) {
            item.tags.forEach(tag => tags.add(tag))
        }
    })
    return [...tags]
}