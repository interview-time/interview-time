import React from "react";
import Header from "../../components/header/header";
import styles from "./layout-wide.module.css";

const LayoutWide = ({ children, header, subheader, actionsLeft, actionsRight }) => {
    return (
        <div className={styles.container}>
            <Header title={header} subtitle={subheader} leftComponent={actionsLeft} rightComponent={actionsRight} />
            {children}
        </div>
    );
};

export default LayoutWide;
