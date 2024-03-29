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
 * @property {string} notes
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
 * @property {string[]} interviewers
 * @property {string} teamId
 * @property {string} candidateId
 * @property {string} candidateNotes
 * @property {string} position
 * @property {string} interviewDateTime
 * @property {string} interviewEndDateTime
 * @property {string} modifiedDate
 * @property {string} templateId
 * @property {string[]} templateIds
 * @property {RedFlags[]} redFlags
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
 * @typedef {Object} RedFlags
 * @property {number} order
 * @property {string} label
 */

/**
 * @typedef {Object} Template
 * @property {string} userId
 * @property {string} templateId
 * @property {string} libraryId
 * @property {string} teamId
 * @property {string} title
 * @property {string} image
 * @property {string} type
 * @property {string} description
 * @property {string} totalInterviews
 * @property {string} createdDate
 * @property {string} token
 * @property {boolean} isShared
 * @property {boolean} isDemo
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

/**
 * @typedef {Object} Team
 * @property {string} teamId
 * @property {string} teamName
 * @property {string} token
 * @property {string[]} roles
 */

/**
 * @typedef {Object} TeamDetails
 * @property {string} teamId
 * @property {string} teamName
 * @property {string} token
 * @property {string} plan
 * @property {number} availableSeats
 * @property {number} seats
 * @property {string[]} pendingInvites
 * @property {string[]} roles
 * @property {TeamMember[]} teamMembers
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} userId
 * @property {string} name
 * @property {string} email
 * @property {boolean} isAdmin
 * @property{string[]} roles
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} name
 * @property {string} email
 * @property {string} userId
 * @property {string} position
 * @property {string} currentTeamId
 * @property {number} timezoneOffset
 * @property {string} timezone
 * @property {Team[]} teams
 */

/**
 * @typedef {Object} Candidate
 * @property {string} candidateId
 * @property {string} candidateName
 * @property {string} createdDate
 * @property {string} position
 * @property {string} resumeUrl
 * @property {string} status
 * @property {string} gitHub
 * @property {string} linkedIn
 * @property {boolean} archived
 */
