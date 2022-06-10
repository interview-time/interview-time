import * as Sentry from "@sentry/react";

export const log = (...args) => {
    if (process.env.NODE_ENV !== "production") {
        console.log(...args);
    }
};

export const logError = error => {
    log(error);
    Sentry.captureException(error);
};
