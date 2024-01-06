import { Team, UserProfile } from "../models";
import { RootState } from "../state-models";

/**
 *
 * @returns {string} - user name or truncated email without '@' symbol
 */
export const selectProfileName = (profile?: UserProfile): string => {
    let name = "";
    if (profile) {
        name = profile.name;
        const emailIndex = name.indexOf("@");
        if (emailIndex !== -1) {
            name = name.substring(0, emailIndex);
        }
    }
    return name;
};

export const selectActiveTeam = (profile: UserProfile): Team | undefined =>
    profile.teams.find(team => team.teamId === profile.currentTeamId);

export const selectUserProfile = (state: RootState) => state.user.profile
