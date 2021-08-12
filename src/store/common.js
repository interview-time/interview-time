export function config(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

export const STATUS_STARTED = "STATUS_STARTED"
export const STATUS_FINISHED = "STATUS_FINISHED"
export const STATUS_ERROR = "STATUS_ERROR"