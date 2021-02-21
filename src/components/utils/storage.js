import moment from "moment";
import { updatesData } from "../../pages/news/news";

const KEY_NEWS_VISIT_TIME = 'news-visit-time'

export function isUpdateAvailable() {
    const newsVisitTime = localStorage.getItem(KEY_NEWS_VISIT_TIME);
    return newsVisitTime === null || updatesData[0].date > parseInt(newsVisitTime)
}

export function updateNewsVisitTime() {
    localStorage.setItem(KEY_NEWS_VISIT_TIME, moment().valueOf().toString())
}