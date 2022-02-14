import moment from "moment";
import { updatesData } from "../../pages/news/news";

const KEY_NEWS_VISIT_TIME = "news-visit-time";
const KEY_QUICKSTART_QUESTION_BANK = "quickstart-question-bank";
const KEY_NOTES_EXPANDED = "sticky-notes-enabled-v1";
const KEY_ACTIVE_TEAM = "selected-team-v3";
const KEY_JOIN_TEAM = "selected-team-v1";

export function isUpdateAvailable() {
    const newsVisitTime = localStorage.getItem(KEY_NEWS_VISIT_TIME);
    return newsVisitTime === null || updatesData[0].date > parseInt(newsVisitTime);
}

export function updateNewsVisitTime() {
    localStorage.setItem(KEY_NEWS_VISIT_TIME, moment().valueOf().toString());
}

export function isQuestionBankClicked() {
    return localStorage.getItem(KEY_QUICKSTART_QUESTION_BANK) !== null;
}

export function isNotesExpanded() {
    const value = localStorage.getItem(KEY_NOTES_EXPANDED);
    return value === "true";
}

export function setNotesExpanded(enabled) {
    localStorage.setItem(KEY_NOTES_EXPANDED, enabled);
}

/**
 *
 * @returns {{teamName: string, teamId: string}|undefined} team
 */
export function getCachedActiveTeam() {
    const value = localStorage.getItem(KEY_ACTIVE_TEAM);
    return value ? JSON.parse(value) : undefined;
}

/**
 *
 * @param {{teamName: string, teamId: string}} team
 */
export function setCachedActiveTeam(team) {
    if (team) {
        localStorage.setItem(KEY_ACTIVE_TEAM, JSON.stringify(team));
    } else {
        localStorage.removeItem(KEY_ACTIVE_TEAM);
    }
}

/**
 *
 * @param {{token: string, role: string}}team
 */
export function setJoinTeam(team) {
    if (team) {
        localStorage.setItem(KEY_JOIN_TEAM, JSON.stringify(team));
    } else {
        localStorage.removeItem(KEY_JOIN_TEAM);
    }
}

/**
 *
 * @returns {{token: string, role: string}|undefined}
 */
export function getJoinTeam() {
    const value = localStorage.getItem(KEY_JOIN_TEAM);
    return value ? JSON.parse(value) : undefined;
}
