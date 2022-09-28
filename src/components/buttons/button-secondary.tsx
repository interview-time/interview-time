import styles from "./button-secondary.module.css";
import { Button } from "antd";
import React from "react";

type Props = {
    [props: string]: any;
};

export const ButtonSecondary = ({ ...props }: Props) => <Button {...props} className={styles.secondaryButton} />;
