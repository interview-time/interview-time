import React from "react";
import styles from "./header.module.css";

type Props = {
    rightComponent: JSX.Element[] | JSX.Element;
    leftComponent: JSX.Element[] | JSX.Element;
    centerComponent: JSX.Element[] | JSX.Element;
};

const HeaderBase = ({ rightComponent, leftComponent, centerComponent }: Props) => {
    return (
        <div className={styles.header}>
            <div className={styles.back}>{leftComponent}</div>
            <>{centerComponent}</>
            <div className={styles.actions}>{rightComponent}</div>
        </div>
    );
};

export default HeaderBase;
