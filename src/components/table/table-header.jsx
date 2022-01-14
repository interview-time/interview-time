import styles from "./table-header.module.css";
import Text from "antd/lib/typography/Text";
import React from "react";

/**
 *
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 * @constructor
 */
const TableHeader = ({ children }) => <Text className={styles.tableHeader}>{children}</Text>

export default TableHeader