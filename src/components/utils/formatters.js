import { format } from "date-fns";

export const getFormattedDateTime = (dateTime, defaultValue = "") => {
    if (!dateTime) {
        return defaultValue;
    }

    const dateTimeFormatted = format(dateTime, "EEE, PP 'at' p");

    return dateTimeFormatted ? dateTimeFormatted : defaultValue;
};
