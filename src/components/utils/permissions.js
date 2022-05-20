import { Roles } from "./constants";

/**
 *
 * @param {UserProfile} profile
 * @returns {Team|undefined}
 */
const currentTeam = profile => profile.teams?.find(team => team.teamId === profile.currentTeamId);

/**
 *
 * @param {UserProfile} profile
 * @returns {boolean}
 */
export const permissionViewCandidates = profile =>
    currentTeam(profile)?.roles?.some(role => role !== Roles.INTERVIEWER);
