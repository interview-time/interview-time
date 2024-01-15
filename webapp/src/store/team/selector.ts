import { TeamDetails, TeamRole } from "../models";
import { RootState } from "../state-models";

export const selectUserRole = (teamDetails: TeamDetails) => teamDetails.roles[0] as TeamRole;

export const selectTeamMembers = (state: RootState) => state.team.details?.teamMembers || [];
