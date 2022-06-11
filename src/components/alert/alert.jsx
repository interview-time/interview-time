import React from "react";
import { Button } from "antd";
import { AlertIcon } from "../../utils/icons";
import styles from "./alert.module.css";

const Alert = ({ title, subtitle, ctaText, onCtaClick }) => {
    return (
        <div className={styles.alert}>
            <div className={styles.left}>
                <AlertIcon style={{ marginRight: 4 }} />
                <span className={styles.title}>{title}</span>
                <span>{subtitle}</span>
            </div>
            <div>
                {onCtaClick && (
                    <Button className={styles.ctaButton} type='default' onClick={onCtaClick}>
                        {ctaText}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Alert;
