import { Roles } from "../../utils/constants";
import { Team, UserProfile } from "../../store/models";

const selectCurrentTeam = (profile: UserProfile): Team | undefined =>
    profile.teams?.find(team => team.teamId === profile.currentTeamId);

export const permissionViewCandidates = (profile: UserProfile): boolean | undefined =>
    selectCurrentTeam(profile)?.roles?.some((role: string) => role !== Roles.INTERVIEWER);

export const isTeamAdmin = (team: Team): boolean => team.roles.some(role => role === Roles.ADMIN);

export const isInElevatedRole = (team: Team): boolean => {
    return team.roles.some(role => role === Roles.ADMIN || role === Roles.HIRING_MANAGER || role === Roles.HR);
};

export const canCancelInvite = (roles: string[], isOwner: boolean) => {
    if (isOwner) {
        return true;
    }

    return roles.some(role => role === Roles.ADMIN);
};
