import moment from "moment";
import { DATE_FORMAT_DISPLAY } from "./constants";

export const isEmpty = (data) => !data || data.length === 0

/**
 * Empty dates stored on backend as '0001-01-01T00:00:00+00:00'
 *
 * @param {string} dateTime
 * @param {string} defaultValue
 * @returns {string}
 */
export const getDate = (dateTime, defaultValue = "") => {
    if (dateTime) {
        const date = moment(dateTime);
        return date.year() > 1 ? date.format(DATE_FORMAT_DISPLAY) : defaultValue;
    }
    return defaultValue
}

/**
 * Empty dates stored on backend as '0001-01-01T00:00:00+00:00'
 *
 * @param {Interview} interview
 * @returns {moment.Moment}
 */
export const orderByInterviewDate = (interview) => {
    const interviewDateTime = moment(interview.interviewDateTime);
    return interviewDateTime.year() > 1 ? interviewDateTime : moment(interview.modifiedDate);
}