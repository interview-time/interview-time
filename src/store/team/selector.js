import { SubscriptionPlans } from "../../utils/constants";

export const FREE_SEATS = 2;
export const PRICE_PER_SEAT = 15; // $

/**
 *
 * @param {TeamDetails} teamDetails
 * @returns string
 */
export const selectTeamPlanName = teamDetails => {
    if (teamDetails.plan === SubscriptionPlans.Starter) {
        return "Starter";
    } else if (teamDetails.plan === SubscriptionPlans.Premium) {
        return "Premium";
    }
    return "";
};

export const selectTeamPrice = teamDetails => {
    if (teamDetails.plan === SubscriptionPlans.Starter) {
        return "Free";
    } else if (teamDetails.plan === SubscriptionPlans.Premium) {
        return (teamDetails.seats - FREE_SEATS) * PRICE_PER_SEAT;
    }

    return "";
};
