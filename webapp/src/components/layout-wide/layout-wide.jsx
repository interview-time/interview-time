import React from "react";
import styles from "./layout-wide.module.css";

const LayoutWide = ({ children }) => {
    return <div className={styles.container}>{children}</div>;
};

export default LayoutWide;
