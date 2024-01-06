import styles from "./logo.module.css";
import React from "react";

type Props = {
    className?: string;
};

export const Logo = ({ className }: Props) => {
    return (
        <div className={`${styles.logoDiv} ${className}`}>
            <img alt='InterviewTime' src={process.env.PUBLIC_URL + "/logo192.png"} className={styles.logoImage} />
            <span className={styles.logoText}>InterviewTime</span>
        </div>
    );
};
