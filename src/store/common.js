import { getCachedActiveTeam } from "../components/utils/storage";

export function config(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

/**
 *
 * @returns {string|undefined}
 */
export const getActiveTeamId = () => {
    const team = getCachedActiveTeam();
    return team ? team.teamId : undefined;
}

export const STATUS_STARTED = "STATUS_STARTED"
export const STATUS_FINISHED = "STATUS_FINISHED"
export const STATUS_ERROR = "STATUS_ERROR"