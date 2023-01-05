import { newsData } from "../pages/news/modal-news";
import { Filter, Sort } from "../pages/jobs/jobs";

const KEY_NEWS_VISIT_INT = "news-visit-version-int";
const KEY_NOTES_EXPANDED = "sticky-notes-enabled-v1";
const KEY_JOIN_TEAM = "selected-team-v1";
const KEY_JOBS_FILTER = "jos-filter-v1";
const KEY_JOBS_SORT = "jos-sort-v1";

const getData = (key: string): any | undefined => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
};

export const setData = (key: string, value: any | undefined) => {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.removeItem(key);
    }
};

export const isUpdateAvailable = () => {
    const newsVisitTime = localStorage.getItem(KEY_NEWS_VISIT_INT);
    return newsVisitTime === null || newsData[0].versionInt > parseInt(newsVisitTime);
};

export const updateNewsVisitTime = () => {
    localStorage.setItem(KEY_NEWS_VISIT_INT, newsData[0].versionInt.toString());
};

export const isNotesExpanded = () => {
    const value = localStorage.getItem(KEY_NOTES_EXPANDED);
    return value === "true";
};

export const setNotesExpanded = (enabled: boolean) => {
    localStorage.setItem(KEY_NOTES_EXPANDED, enabled.toString());
};

type JoinTeam = {
    token: string;
    role: string;
};

export const setJoinTeam = (team: JoinTeam | undefined) => setData(KEY_JOIN_TEAM, team);

export const getJoinTeam = (): JoinTeam | undefined => getData(KEY_JOIN_TEAM);

export const setJobFilterToStorage = (filter: Filter | undefined) => setData(KEY_JOBS_FILTER, filter);

export const getJobFilterFromStorage = (): Filter | undefined => getData(KEY_JOBS_FILTER);

export const setJobSortToStorage = (sort: Sort | undefined) => setData(KEY_JOBS_SORT, sort);

export const getJobSortFromStorage = (): Sort | undefined => getData(KEY_JOBS_SORT);
