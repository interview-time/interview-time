import React from "react";
import { Card } from "antd";
import styles from "./template-card.module.css";

const TemplateCard = ({ name, image, totalQuestions, onClick }) => {
    return (
        <Card hoverable bodyStyle={{ padding: 0, height: 190 }}>
            <div className={styles.card} onClick={onClick}>
                <div>
                    <img src={image} />
                </div>
                <div className={styles.cardTitle}>{name}</div>
                <div className={styles.cardMetaTitle}>{totalQuestions} QUESTIONS</div>
            </div>
        </Card>
    );
};

export default TemplateCard;
