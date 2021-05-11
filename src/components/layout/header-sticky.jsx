import styles from "./header.module.css";
import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

/**
 *
 * @param {String} title
 * @param {boolean} backButton
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 * @constructor
 */
const StickyHeader = ({title, backButton, children}) => {

    const history = useHistory();

    const onBackClicked = () => {
        history.goBack()
    }

    return (
        <div className={styles.stickyHeader}>
            {backButton && <div onClick={onBackClicked} style={{ cursor: 'pointer' }}>
                <ArrowLeftOutlined />
                <span className={styles.headerTitle}>{title}</span>
            </div>}
            {!backButton && <span className={styles.headerTitle}>{title}</span>}
            {children}
        </div>
    );
}

export default StickyHeader