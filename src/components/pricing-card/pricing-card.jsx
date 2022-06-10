import React from "react";
import { Button, Card } from "antd";
import { SubscriptionPlans } from "../../utils/constants";
import yesImg from "../../assets/yes.png";
import noImg from "../../assets/no.png";
import { getHost, routeTeamSettings } from "../../utils/route";
import styles from "./pricing-card.module.css";

const PricingCard = ({ plan, title, subtitle, features, priceId, currentPlan, email, teamId }) => {
    return (
        <Card className={styles.card}>
            <h3 className={styles.name}>{plan}</h3>
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.subtitle}>{subtitle}</p>
            <div className={styles.divider}></div>
            <ul className={styles.features}>
                {features.map(feature => (
                    <li className={styles.feature}>
                        <img
                            className={styles.featureImg}
                            width='16'
                            src={feature.available ? yesImg : noImg}
                            alt={feature.name}
                        />
                        <p className={styles.featureName}>{feature.name}</p>
                    </li>
                ))}
            </ul>
            <div>
                {plan === SubscriptionPlans.Premium ? (
                    <form action={`${process.env.REACT_APP_API_URL}/subscription/stripe-session`} method='POST'>
                        <input type='hidden' name='PriceId' value={priceId} />
                        <input type='hidden' name='SuccessUrl' value={`${getHost()}${routeTeamSettings(teamId)}`} />
                        <input type='hidden' name='CancelUrl' value={`${getHost()}${routeTeamSettings(teamId)}`} />
                        <input type='hidden' name='Email' value={email} />
                        <input type='hidden' name='TeamId' value={teamId} />

                        <Button block htmlType='submit' type='primary'>
                            {currentPlan !== SubscriptionPlans.Premium ? "Get Started" : "Buy More Seats"}
                        </Button>
                    </form>
                ) : (
                    currentPlan === SubscriptionPlans.Starter && (
                        <Button block disabled>
                            Current Plan
                        </Button>
                    )
                )}
            </div>
        </Card>
    );
};

export default PricingCard;
