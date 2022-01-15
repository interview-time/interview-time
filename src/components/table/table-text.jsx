import styles from "./table-text.module.css";
import Text from "antd/lib/typography/Text";
import React from "react";

/**
 *
 * @param {string} className
 * @param {JSX.Element|string} children
 * @returns {JSX.Element}
 * @constructor
 */
const TableText = ({ className, children }) =>
    <Text className={`${styles.text} ${className}`}>{children}</Text>

export default TableText