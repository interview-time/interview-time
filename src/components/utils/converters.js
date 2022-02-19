/**
 *
 * @param {String} id
 * @param {Question[]} questions
 * @returns {*}
 */
export function findQuestion(id, questions) {
    return questions.find(question => question.questionId === id);
}

/**
 *
 * @param {String} id
 * @param {[CategoryHolder]} categories
 * @returns {CategoryHolder}
 */
export function findCategory(id, categories) {
    return categories.find(item => item.category.categoryId === id);
}

/**
 *
 * @param {String} id
 * @param {[Interview]} interviews
 * @returns {Interview}
 */
export function findInterview(id, interviews) {
    return interviews.find(interview => interview.interviewId === id);
}

/**
 *
 * @param {String} id
 * @param {[Template]} templates
 * @returns {Template}
 */
export function findTemplate(id, templates) {
    return templates.find(template => template.templateId === id);
}

/**
 *
 * @param {String} id
 * @param {[Template]} templates
 * @returns {Template}
 */
export function findLibraryTemplate(id, templates) {
    return templates.find(template => template.libraryId === id);
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
        let question = findQuestion(id, group.questions);
        if (question) {
            return question;
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
        let question = findQuestion(id, category.questions);
        if (question) {
            return question;
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
    return group.questions.map(q => q.questionId).map(id => findQuestionInCategories(id, categories));
}

/**
 *
 * @param {(Interview|Template)} interview
 * @returns {[String]}
 */
export function interviewToTags(interview) {
    let tags = new Set();
    interview.structure.groups.forEach(group => {
        group.questions.forEach(item => {
            if (item.tags) {
                item.tags.forEach(tag => tags.add(tag));
            }
        });
    });
    return [...tags];
}
