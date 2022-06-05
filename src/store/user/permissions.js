import { Roles } from "../../utils/constants";

/**
 *
 * @param {UserProfile} profile
 * @returns {Team|undefined}
 */
const selectCurrentTeam = profile => profile.teams?.find(team => team.teamId === profile.currentTeamId);

/**
 *
 * @param {UserProfile} profile
 * @returns {boolean}
 */
export const permissionViewCandidates = profile =>
    selectCurrentTeam(profile)?.roles?.some(role => role !== Roles.INTERVIEWER);
