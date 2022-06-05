import React from "react";
import { Button, Card } from "antd";
import yesImg from "../../assets/yes.png";
import noImg from "../../assets/no.png";
import styles from "./pricing-card.module.css";

const PricingCard = ({ name, title, subtitle, features, onClick }) => {
    return (
        <Card className={styles.card}>
            <h3 className={styles.name}>{name}</h3>
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
                {onClick ? (
                    <Button block type='primary' onClick={onClick}>
                        Get Started
                    </Button>
                ) : (
                    <Button block disabled>
                        Current Plan
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default PricingCard;
