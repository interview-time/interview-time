import React from "react";
import { Typography } from "antd";
import styles from "./header.module.css";
import Text from "antd/lib/typography/Text";

const { Title } = Typography;

const Header = ({ title, subtitle, rightComponent, leftComponent }) => {
    return (
        <div className={styles.header}>
            <div className={styles.back}>{leftComponent}</div>
            <div className={styles.candidate}>
                <Title level={4} style={{ marginBottom: 0 }}>
                    {title}
                </Title>
                <Text type="secondary" className={styles.subheader}>{subtitle}</Text>
            </div>
            <div className={styles.actions}>{rightComponent}</div>
        </div>
    );
};

export default Header;
