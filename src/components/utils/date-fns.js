import { addHours, addMinutes, isBefore, set } from "date-fns";
import { format, formatInTimeZone } from "date-fns-tz";
import { enAU, enCA, enGB, enIN, enNZ, enUS } from "date-fns/locale";

const locales = {
    "en-CA": enCA,
    "en-IN": enIN,
    "en-NZ": enNZ,
    "en-GB": enGB,
    "en-AU": enAU,
    "en-US": enUS,
};

const DEFAULT_LOCALE = "en-US";

export const DATE_FORMAT_SERVER = "yyyy-MM-dd'T'HH:mm:ssX";

/**
 * Parse a date string into a Date object.
 * @param {string} dateTime
 * @param defaultValue
 * @returns {undefined|Date}
 */
export const parseDate = (dateTime, defaultValue = undefined) => {
    if (dateTime) {
        const date = new Date(dateTime);
        return date.getFullYear() > 1 ? date : defaultValue;
    }
    return defaultValue;
};

/**
 * Returns formatted date in UTC timezone e.g. 2022-01-01T23:00:00Z
 * @param date {Date | string | number}
 * @returns {string}
 */
export const formatDateUTC = date => formatInTimeZone(date, "UTC", DATE_FORMAT_SERVER);

/**
 * Returns formatted date taking into account locale
 * @param date {Date|string|undefined}
 * @param dateFormat {string}
 * @param defaultValue {string}
 * @returns {string}
 */
export const formatDate = (date, dateFormat, defaultValue = "") => {
    if (date) {
        let parsedDate = date instanceof Date ? date : parseDate(date);
        const browserLocale = locales[getNavigatorLanguage()];
        return format(parsedDate, dateFormat, { locale: browserLocale ? browserLocale : enUS });
    }
    return defaultValue;
};
/**
 * Returns formatted date taking into account locale, format: Sat, 19 February 2022 at 10:00 AM (locale aware)
 * @param date {Date|string|undefined}
 * @param defaultValue {string}
 * @returns {string}
 */
export const getFormattedDateTime = (date, defaultValue = "") => formatDate(date, "EEE, PP 'at' p", defaultValue);

/**
 * Returns locale aware date format
 * @returns {string} e.g. 18 Feb 2022
 */
export const datePickerFormat = () => "PP";

/**
 * Returns locale aware time format
 * @returns {string} 'hh:mm A' or 'hh:mm'
 */
export const timePickerFormat = () => "p";

/**
 * Generates 24h time slots with the given duration
 * @param duration {number} duration in minutes e.g. 15
 * @returns {*[]}
 */
export const generateTimeSlots = (duration = 15) => {
    let timeFormat = timePickerFormat();
    const timeSlots = [];
    let start = set(new Date(), { hours: 9, minutes: 0 });
    let end = addHours(start, 24);

    let current = start;
    while (isBefore(current, end)) {
        timeSlots.push({
            label: formatDate(current, timeFormat),
            value: formatDate(current, "HH:mm"),
        });
        current = addMinutes(current, duration);
    }

    return timeSlots;
};

/**
 * Returns the current locale, e.g. en-AU
 * @returns {string|*|string}
 */
const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    } else {
        return navigator.language || DEFAULT_LOCALE;
    }
};
