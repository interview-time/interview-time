import styles from "./table-header.module.css";
import Text from "antd/lib/typography/Text";
import React from "react";

type Props = {
    children: JSX.Element[] | JSX.Element | string;
};

const TableHeader = ({ children }: Props) => <Text className={styles.tableHeader}>{children}</Text>;

export default TableHeader;
