import styles from "./card-hero.module.css";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import Card from "./card";
import React from "react";

/**
 *
 * @param {JSX.Element} icon
 * @param {string|number} title
 * @param {string|number} text
 * @param {function} onClick
 * @returns {JSX.Element}
 * @constructor
 */
const CardHero = ({ icon, title, text, onClick }) => (
    <Card onClick={onClick} className={styles.card}>
        <div className={styles.iconHolder}>{icon}</div>
        <div className={styles.textHolder}>
            <Title level={5} style={{ marginBottom: 0 }} className={styles.title}>
                {title}
            </Title>
            <Text className={styles.label}>{text}</Text>
        </div>
    </Card>
);

export default CardHero;
