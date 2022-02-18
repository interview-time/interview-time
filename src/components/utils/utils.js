import moment from "moment";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_DISPLAY_LONG, DATE_FORMAT_DISPLAY_TIME } from "./constants";

export const isEmpty = data => !data || data.length === 0;

/**
 * Empty dates stored on backend as '0001-01-01T00:00:00+00:00'
 *
 * @param {string} dateTime
 * @param {string} defaultValue
 * @returns {string}
 */
export const getFormattedDateSimple = (dateTime, defaultValue = "") => {
    if (dateTime) {
        const date = moment(dateTime);
        return date.year() > 1 ? date.format("ll") : defaultValue;
    }
    return defaultValue;
};

/**
 * Empty dates stored on backend as '0001-01-01T00:00:00+00:00'
 *
 * @param {string} dateTime
 * @param {string} defaultValue
 * @returns {string}
 */
export const getFormattedDate = (dateTime, defaultValue = "") => {
    if (dateTime) {
        const date = moment(dateTime);
        return date.year() > 1 ? date.format(DATE_FORMAT_DISPLAY) : defaultValue;
    }
    return defaultValue;
};

/**
 * Empty dates stored on backend as '0001-01-01T00:00:00+00:00'
 *
 * @param {string} dateTime
 * @param {string} defaultValue
 * @returns {string}
 */
export const getFormattedDateLong = (dateTime, defaultValue = "") => {
    if (dateTime) {
        const date = moment(dateTime);
        return date.year() > 1 ? date.format(DATE_FORMAT_DISPLAY_LONG) : defaultValue;
    }
    return defaultValue;
};

/**
 * Empty dates stored on backend as '0001-01-01T00:00:00+00:00'
 *
 * @param {string} start
 * @param {string} end
 * @param {string} defaultValue
 * @returns {string}
 */
export const getFormattedTimeRange = (start, end, defaultValue = "") => {
    let time = undefined;
    if (start) {
        const startDate = moment(start);
        if (startDate.year() > 1) {
            time = startDate.format(DATE_FORMAT_DISPLAY_TIME);
        }

        if (end) {
            const endDate = moment(end);
            if (endDate.year() > 1) {
                time += ` - ${endDate.format(DATE_FORMAT_DISPLAY_TIME)}`;
            }
        }
    }
    return time ? time : defaultValue;
};

/**
 *
 * @param {string} dateTime
 * @param {undefined|string} defaultValue
 * @returns {undefined|moment.Moment}
 */
export const getDate = (dateTime, defaultValue = undefined) => {
    if (dateTime) {
        const date = moment(dateTime);
        return date.year() > 1 ? date : defaultValue;
    }
    return defaultValue;
};

/**
 * Empty dates stored on backend as '0001-01-01T00:00:00+00:00'
 *
 * @param {Interview} interview
 * @returns {moment.Moment}
 */
export const orderByInterviewDate = interview => {
    const interviewDateTime = moment(interview.interviewDateTime);
    return interviewDateTime.year() > 1 ? interviewDateTime : moment(interview.modifiedDate);
};

export const getParameterByName = (name, url = window.location.href) => {
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
