/**
 * @typedef {Object} Category
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} categoryName
 * @property {string|null} image
 * @property {boolean} isActive
 * @property {string} createdDate
 * @property {string} modifiedDate
 */

/**
 * @typedef {Object} Question
 * @property {string} userId
 * @property {string} questionId
 * @property {string} category
 * @property {string} categoryId
 * @property {string} question
 * @property {string} difficulty
 * @property {string|null} parentQuestionId
 * @property {string[]} tags
 * @property {string} createdDate
 * @property {string} modifiedDate
 * @property {number} assessment
 */

/**
 * @typedef {Object} CategoryHolder
 * @property {Category} category
 * @property {Question[]} questions
 */

/**
 * @typedef {Object} Interview
 * @property {string} userId
 * @property {string} interviewId
 * @property {string} candidate
 * @property {string} candidateNotes
 * @property {string} position
 * @property {string} interviewDateTime
 * @property {string} templateId
 * @property {string} status
 * @property {string} decision
 * @property {string} notes
 * @property {number} decision
 * @property {InterviewStructure} structure
 */

/**
 * @typedef {Object} InterviewStructure
 * @property {string} header
 * @property {string} footer
 * @property {InterviewGroup[]} groups
 */

/**
 * @typedef {Object} InterviewGroup
 * @property {string} groupId
 * @property {string} name
 * @property {string} notes
 * @property {number} assessment
 * @property {Question[]} questions
 */

/**
 * @typedef {Object} Template
 * @property {string} userId
 * @property {string} templateId
 * @property {string} libraryId
 * @property {string} title
 * @property {string} image
 * @property {string} type
 * @property {string} description
 * @property {string} totalInterviews
 * @property {TemplateStructure} structure
 */

/**
 * @typedef {Object} TemplateStructure
 * @property {string} header
 * @property {string} footer
 * @property {TemplateGroup[]} groups
 */

/**
 * @typedef {Object} TemplateGroup
 * @property {string} groupId
 * @property {string} name
 * @property {Question[]} questions
 */