import { Roles } from "../../utils/constants";
import { Team, UserProfile } from "../../store/models";
import { RootState } from "../state-models";
import { selectActiveTeam } from "./selector";

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

export const canAddCandidate = (state: RootState) => {
    const team = selectActiveTeam(state.user.profile);
    if (team) {
        return team.roles.some(role => role !== Roles.INTERVIEWER);
    }

    return false;
};

export const canIntegrateWithATS = (state: RootState) => {
    const team = selectActiveTeam(state.user.profile);
    if (team) {
        return team.roles.some(role => role === Roles.ADMIN);
    }

    return false;
};
