import React from "react";
import { Button, Card } from "antd";
import { SubscriptionPlans } from "../../utils/constants";
import yesImg from "../../assets/yes.png";
import noImg from "../../assets/no.png";
import styles from "./pricing-card.module.css";
import PaymentForm from "../stripe/payment-form";

const PricingCard = ({ plan, title, subtitle, features, priceId, currentPlan, email, teamId }) => {
    return (
        <Card className={`${styles.card} ${plan === SubscriptionPlans.Premium && styles.premium}`}>
            <h3 className={`${styles.name} ${plan === SubscriptionPlans.Premium && styles.namePremium}`}>{plan}</h3>
            <h4 className={`${styles.title} ${plan === SubscriptionPlans.Premium && styles.titlePremium}`}>{title}</h4>
            <p className={`${styles.subtitle} ${plan === SubscriptionPlans.Premium && styles.subtitlePremium}`}>
                {subtitle}
            </p>
            <div className={styles.divider}></div>
            <div className={styles.featuredWrapper}>
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
                        <PaymentForm
                            buttonText={currentPlan !== SubscriptionPlans.Premium ? "Get Started" : "Buy More Seats"}
                            priceId={priceId}
                            userEmail={email}
                            teamId={teamId}
                        />
                    ) : (
                        <Button block disabled>
                            {currentPlan === SubscriptionPlans.Starter ? "Current Plan" : "Not Available"}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default PricingCard;
