import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import styles from "./header.module.css";

const { Text, Title } = Typography;

const Header = ({ title, subtitle, rightComponent, showBackButton = true }) => {
    const history = useHistory();

    return (
        <Card>
            <div className={styles.header}>
                <div className={styles.back}>
                    {showBackButton && (
                        <Button
                            icon={<LeftOutlined />}
                            size="large"
                            onClick={() => history.goBack()}
                        />
                    )}
                </div>
                <div className={styles.candidate}>
                    <Title level={4} style={{ marginBottom: 0 }}>
                        {title}
                    </Title>
                    <Text type="secondary">{subtitle}</Text>
                </div>
                <div className={styles.actions}>{rightComponent}</div>
            </div>
        </Card>
    );
};

export default Header;
