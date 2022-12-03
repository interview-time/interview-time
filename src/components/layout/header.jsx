import styles from "./header.module.css";
import React from "react";
import BackButton from "../back-button/back-button";
import { useHistory } from "react-router-dom";

/**
 *
 * @param {String} title
 * @param {boolean} backButton
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 * @constructor
 */
const Header = ({ title, backButton, children }) => {
    const history = useHistory();

    return (
        <div className={styles.header} style={{ flexDirection: "column" }}>
            {backButton && <BackButton title={title} onClick={() => history.goBack()} />}
            {!backButton && <span className={styles.headerTitle}>{title}</span>}
            {children}
        </div>
    );
};

export default Header;
