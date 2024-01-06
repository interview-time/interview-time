import * as Sentry from "@sentry/react";
import { addHours, addMinutes, formatISO, isBefore, parseISO, set } from "date-fns";
import { format, getTimezoneOffset } from "date-fns-tz";
import { enAU, enCA, enGB, enIN, enNZ, enUS } from "date-fns/locale";
import { log } from "./log";

const locales = {
    "en-CA": enCA,
    "en-IN": enIN,
    "en-NZ": enNZ,
    "en-GB": enGB,
    "en-AU": enAU,
    "en-US": enUS,
};

const DEFAULT_LOCALE = "en-US";

/**
 * Parse a date from ISO string into a Date object.
 * @param {string} dateTime
 * @param defaultValue
 * @returns {undefined|Date}
 */
export const parseDateISO = (dateTime, defaultValue = undefined) => {
    if (dateTime) {
        const date = parseISO(dateTime);
        return date.getFullYear() > 1 ? date : defaultValue;
    }
    return defaultValue;
};

/**
 * Returns formatted date in ISO format, e.g. 2022-05-09T15:45:00+10:00
 * @param date {Date | number}
 * @returns {string}
 */
export const formatDateISO = date => formatISO(date);

/**
 * Returns formatted date taking into account locale
 * @param date {Date|string|undefined}
 * @param dateFormat {string}
 * @param defaultValue {string}
 * @returns {string}
 */
export const formatDate = (date, dateFormat, defaultValue = "") => {
    try {
        if (date) {
            let parsedDate = date instanceof Date ? date : parseDateISO(date);
            const browserLocale = locales[getNavigatorLanguage()];
            return format(parsedDate, dateFormat, { locale: browserLocale ? browserLocale : enUS });
        }
    } catch (e) {
        Sentry.captureException(e);
    }
    return defaultValue;
};

/**
 * Returns formatted time taking into account locale, format: 10:00 AM or 18:00
 * @param date {Date|string|undefined}
 * @param defaultValue {string}
 * @returns {string}
 */
export const getFormattedTime = (date, defaultValue = "") => formatDate(date, "p", defaultValue);

/**
 * Returns formatted date taking into account locale, format: Sat, 19 February 2022 at 10:00 AM
 * @param date {Date|string|undefined}
 * @param defaultValue {string}
 * @returns {string}
 */
export const getFormattedDateTime = (date, defaultValue = "") => formatDate(date, "EEE, PP 'at' p", defaultValue);

/**
 * Returns formatted date taking into account locale, format: Sat, 19 February 2022
 * @param date {Date|string|undefined}
 * @param defaultValue {string}
 * @returns {string}
 */
export const getFormattedDate = (date, defaultValue = "") => formatDate(date, "EEE, PP", defaultValue);

/**
 * Returns formatted date taking into account locale, format: 19 February 2022
 * @param date {Date|string|undefined}
 * @param defaultValue {string}
 * @returns {string}
 */
export const getFormattedDateShort = (date, defaultValue = "") => formatDate(date, "PP", defaultValue);

/**
 * Returns formatted time range taking into account locale, format: 20:00 - 21:00
 * @param start {Date|string}
 * @param end {Date|string}
 * @param defaultValue {string}
 * @returns {string}
 */
export const getFormattedTimeRange = (start, end, defaultValue = "") => {
    const formattedDateStart = formatDate(start, "p", defaultValue);
    const formattedDateEnd = formatDate(end, "p", defaultValue);

    if (formattedDateStart && formattedDateEnd) {
        return `${formattedDateStart} - ${formattedDateEnd}`;
    } else if (formattedDateStart) {
        return formattedDateStart;
    }
    return defaultValue;
};

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

/**
 *
 * @returns {{offsetMinutes: number, timezone: string}}
 */
export const getCurrentTimezone = () => ({
    offsetMinutes: new Date().getTimezoneOffset(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

const timezones = [];

export const getAllTimezones = () => {
    if (timezones.length === 0) {
        log("TimezoneSelectorData is empty, populating array...");
        const timezonesIntl = Intl.supportedValuesOf("timeZone");
        const date = new Date();

        timezonesIntl.forEach(timezone => {
            const offsetLabel = format(date, "OOOO", { timeZone: timezone }); // GMT+10:00
            let offsetMinutes = getTimezoneOffset(timezone) / 1000 / 60; // GMT+10:00 = 600, GMT-10:00 = -600
            offsetMinutes *= -1; // convert to 'Date.getTimezoneOffset' (opposite value to what 'date-fns-tz' returns
            timezones.push({
                timezone: timezone,
                label: `(${offsetLabel}) ${timezone}`, // '(GMT+10:00) Australia/Sydney'
                offsetMinutes: offsetMinutes,
            });
        });

        console.log(timezones);
    }

    return timezones;
};
