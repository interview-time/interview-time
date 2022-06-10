import React from "react";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { routeSubscription } from "../../utils/route";
import styles from "./alert.module.css";

const Alert = ({ title, subtitle, ctaText, onClose }) => {
    const history = useHistory();

    return (
        <div className={styles.alert}>
            <div className={styles.leftF}>
                <span className={styles.title}>{title}</span>
                <span>{subtitle}</span>
            </div>
            <div>
                <Button className={styles.ctaButton} type='default' onClick={() => history.push(routeSubscription())}>
                    {ctaText}
                </Button>
            </div>
        </div>
    );
};

export default Alert;
