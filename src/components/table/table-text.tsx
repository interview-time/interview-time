import styles from "./table-text.module.css";
import Text from "antd/lib/typography/Text";
import React from "react";

type Props = {
    className?: string;
    children: JSX.Element[] | JSX.Element | string | string[];
};
const TableText = ({ className, children }: Props) => <Text className={`${styles.text} ${className}`}>{children}</Text>;

export default TableText;
