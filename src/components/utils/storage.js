import moment from "moment";
import { updatesData } from "../../pages/news/news";

const KEY_NEWS_VISIT_TIME = 'news-visit-time'
const KEY_QUICKSTART_DISPLAYED = 'quickstart-displayed'
const KEY_QUICKSTART_QUESTION_BANK = 'quickstart-question-bank'
const KEY_QUICKSTART_INTERVIEWS = 'quickstart-interviews'
const KEY_QUICKSTART_TEMPLATES = 'quickstart-templates'
const KEY_STICKY_NOTES_ENABLED = 'sticky-notes-enabled'

export function isUpdateAvailable() {
    const newsVisitTime = localStorage.getItem(KEY_NEWS_VISIT_TIME);
    return newsVisitTime === null || updatesData[0].date > parseInt(newsVisitTime)
}

export function updateNewsVisitTime() {
    localStorage.setItem(KEY_NEWS_VISIT_TIME, moment().valueOf().toString())
}

export function isQuickstartDisplayed() {
    return localStorage.getItem(KEY_QUICKSTART_DISPLAYED) !== null
}

export function updateQuickstartDisplayed() {
    localStorage.setItem(KEY_QUICKSTART_DISPLAYED, "true")
}

export function isQuestionBankClicked() {
    return localStorage.getItem(KEY_QUICKSTART_QUESTION_BANK) !== null
}

export function updateQuestionBankClicked() {
    localStorage.setItem(KEY_QUICKSTART_QUESTION_BANK, "true")
}

export function isAddInterviewClicked() {
    return localStorage.getItem(KEY_QUICKSTART_INTERVIEWS) !== null
}

export function updateAddInterviewClicked() {
    localStorage.setItem(KEY_QUICKSTART_INTERVIEWS, "true")
}

export function isAddTemplateClicked() {
    return localStorage.getItem(KEY_QUICKSTART_TEMPLATES) !== null
}

export function updateAddTemplateClicked() {
    localStorage.setItem(KEY_QUICKSTART_TEMPLATES, "true")
}

export function isStickyNotesEnabled() {
    const value = localStorage.getItem(KEY_QUICKSTART_TEMPLATES);
    return value === null || value === "true"
}

export function setStickyNotesEnabled(enabled) {
    localStorage.setItem(KEY_QUICKSTART_TEMPLATES, enabled)
}