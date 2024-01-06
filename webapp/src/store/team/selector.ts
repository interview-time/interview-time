import { SubscriptionPlans } from "../../utils/constants";
import { TeamDetails, TeamRole } from "../models";
import { RootState } from "../state-models";

export const FREE_SEATS = 2;
export const PRICE_PER_SEAT = 15; // $

export const selectTeamPlanName = (teamDetails: TeamDetails) => {
    if (teamDetails.plan === SubscriptionPlans.Starter) {
        return "Starter";
    } else if (teamDetails.plan === SubscriptionPlans.Premium) {
        return "Premium";
    }
    return "";
};

export const selectTeamPrice = (teamDetails: TeamDetails) => {
    if (teamDetails.plan === SubscriptionPlans.Starter) {
        return "Free";
    } else if (teamDetails.plan === SubscriptionPlans.Premium) {
        return (teamDetails.seats - FREE_SEATS) * PRICE_PER_SEAT;
    }

    return "";
};

export const selectUserRole = (teamDetails: TeamDetails) => teamDetails.roles[0] as TeamRole

export const selectTeamMembers = (state: RootState) => state.team.details?.teamMembers || []
