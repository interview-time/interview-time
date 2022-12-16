import styles from "./table-header.module.css";
import { Typography } from "antd";
import React from "react";

type Props = {
    children: JSX.Element[] | JSX.Element | string;
};

const { Text } = Typography;

const TableHeader = ({ children }: Props) => <Text className={styles.tableHeader}>{children}</Text>;

export default TableHeader;
