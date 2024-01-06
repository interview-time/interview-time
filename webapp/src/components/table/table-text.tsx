import styles from "./table-text.module.css";
import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

type Props = {
    className?: string;
    children: JSX.Element[] | JSX.Element | string | string[];
};
const TableText = ({ className, children }: Props) => <Text className={`${styles.text} ${className}`}>{children}</Text>;

export default TableText;
