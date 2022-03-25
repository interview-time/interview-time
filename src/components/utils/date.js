import moment from "moment";
import "moment/locale/en-au"; // English (Australia)
import "moment/locale/en-ca"; // English (Canada)
import "moment/locale/en-in"; // English (India)
import "moment/locale/en-nz"; // English (New Zealand)
import "moment/locale/en-sg"; // English (Singapore)
import "moment/locale/en-gb"; // English (United Kingdom)

export const isEmpty = data => !data || data.length === 0;

/**
 * Empty dates stored on backend as '0001-01-01T00:00:00+00:00'
 *
 * @param {string} dateTime
 * @param {string} format
 * @returns {string}
 */
const formatDate = (dateTime, format) => {
    if (dateTime) {
        const date = moment(dateTime);
        if (date.year() > 1) {
            return date.format(format);
        }
    }
    return undefined;
};

export const getFormattedDateShort = (dateTime, defaultValue = "") => {
    const formattedDate = formatDate(dateTime, "ll");
    return formattedDate ? formattedDate : defaultValue;
};

export const getFormattedDate = (dateTime, defaultValue = "") => {
    let date = formatDate(dateTime, "ddd, ll"); // Sat, 19 February 2022 (locale aware)
    return date ? date : defaultValue;
};

export const getFormattedDateTime = (dateTime, defaultValue = "") => {
    let date = formatDate(dateTime, "ddd, ll [at] LT"); // Sat, 19 February 2022 at 10:00 AM (locale aware)
    return date ? date : defaultValue;
};

export const getFormattedTimeRange = (start, end, defaultValue = "") => {
    const formattedDateStart = formatDate(start, "LT");
    const formattedDateEnd = formatDate(end, "LT");

    if (formattedDateStart && formattedDateEnd) {
        return `${formattedDateStart} - ${formattedDateEnd}`;
    } else if (formattedDateStart) {
        return formattedDateStart;
    }
    return defaultValue;
};

/**
 * Returns locale aware time format
 * @returns {string} 'hh:mm A' or 'hh:mm'
 */
export const timePickerFormat = () => {
    let date = moment().format("LT");
    if (date.includes("AM") || date.includes("PM")) {
        return "hh:mm A";
    } else {
        return "hh:mm";
    }
};

export const datePickerFormat = () => "ddd, ll"; // 18 Feb 2022

/**
 *
 * @param {string} dateTime
 * @param defaultValue
 * @returns {undefined|moment.Moment}
 */
export const getDate = (dateTime, defaultValue = undefined) => {
    if (dateTime) {
        const date = moment(dateTime);
        return date.year() > 1 ? date : defaultValue;
    }
    return defaultValue;
};

export const orderByInterviewDate = interview => {
    const interviewDateTime = moment(interview.interviewDateTime);
    return interviewDateTime.year() > 1 ? interviewDateTime : moment(interview.modifiedDate);
};

export const generateTimeSlots = (duration = 15) => {
    let format = timePickerFormat();

    const timeSlots = [];
    let start = moment().hour(9).minutes(0);
    let end = start.clone().add(24, "hours");

    let current = start.clone();
    while(current.isBefore(end)) {
        timeSlots.push({
            label: current.format(format),
            value: current.format()
        });
        current.add(duration, "minutes");
    }

    return timeSlots;
};
