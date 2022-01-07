import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Typography } from "antd";
import styles from "./header.module.css";
import { BackIcon } from "../utils/icons";
import Text from "antd/lib/typography/Text";

const { Title } = Typography;

const Header = ({ title, subtitle, rightComponent, showBackButton = true }) => {
    const history = useHistory();

    return (
        <div className={styles.header}>
            <div className={styles.back}>
                {showBackButton && (
                    <Button
                        icon={<BackIcon />}
                        size="large"
                        onClick={() => history.goBack()}
                    />
                )}
            </div>
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
