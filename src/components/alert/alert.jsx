import React from "react";
import { Button } from "antd";
import { AlertIcon } from "../../utils/icons";
import styles from "./alert.module.css";

const Alert = ({ title, subtitle, ctaText, onCtaClick }) => {
    return (
        <div className={styles.alert}>
            <div className={styles.left}>
                <AlertIcon style={{ marginRight: 10 }} />
                <div>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.subtitle}>{subtitle}</div>
                </div>
            </div>
            <div className={styles.action}>
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
