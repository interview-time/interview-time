import styles from "./card-hero.module.css";
import { Space } from "antd";
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
    <Card onClick={onClick}>
        <Space size={24}>
            <div className={styles.iconHolder}>{icon}</div>
            <div>
                <Title level={5} style={{ marginBottom: 0 }}>
                    {title}
                </Title>
                <Text className={styles.label}>{text}</Text>
            </div>
        </Space>
    </Card>
);

export default CardHero;
