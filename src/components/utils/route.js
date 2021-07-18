export const routeHome = () => "/"

export const routeNews = () => "/news"

export const routeInterviews = () => "/interviews"

export const routeReports = () => "/reports"

export const routeInterviewDetails = (id) => `/interviews/details/${id}`

export const routeInterviewAdd = () => `/interviews/add`

export const routeInterviewAddFromTemplate = (id) => `/interviews/add?fromTemplate=${id}`

export const routeInterviewAddFromLibrary = (id) => `/interviews/add?fromLibrary=${id}`

export const routeInterviewReport = (id) => `/reports/${id}`

export const routeInterviewScorecard = (id) => `/interviews/scorecard/${id}`

export const routeInterviewCandidate = (id) => `/interviews/evaluation/${id}`

export const routeTemplates = () => "/templates"

export const routeTemplateBlank = () => "/templates/add/"

export const routeTemplateBlankFromLibrary = (id) => `/templates/add?fromLibrary=${id}`

export const routeTemplateDetails = (id) => `/templates/edit/${id}`

export const routeTemplatePreview = (id) => `/templates/preview/${id}`

export const routeQuestionBank = () => "/question-bank"

export const routeTemplateNew = () => "/templates/new/"

export const routeQuestionBankCategory = (id) => `/question-bank/${id}`

export const routeAccount = () => "/account"