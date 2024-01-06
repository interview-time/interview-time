import React from "react";
import styles from "./feature.module.css";

const Feature = ({ icon, title, description }) => {
    return (
        <div className={styles.feature}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
        </div>
    );
};

export default Feature;
