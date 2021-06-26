import React from "react";
import { Card } from "antd";
import defaultIcon from "../../assets/layout.png";
import styles from "./library-card.module.css";

const LibraryCard = ({ name, image, totalQuestions, onClick }) => {
    return (
        <Card hoverable bodyStyle={{ padding: 0 }} onClick={onClick}>
            <div className={styles.card}>
                <div>
                    <img alt={name} src={image ? image : defaultIcon} width={50} />
                </div>
                <div className={styles.cardTitle}>{name}</div>
                <div className={styles.cardMetaTitle}>{totalQuestions} QUESTIONS</div>
            </div>
        </Card>
    );
};

export default LibraryCard;
