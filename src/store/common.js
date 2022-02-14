import { getCachedActiveTeam } from "../components/utils/storage";

export function config(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

/**
 *
 * @returns {string|undefined}
 */
export const getActiveTeamId = () => {
    const team = getCachedActiveTeam();
    return team ? team.teamId : undefined;
};
