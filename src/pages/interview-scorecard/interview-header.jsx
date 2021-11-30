import React from "react";
import { Button, Card, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import styles from "./interview-header.module.css";

const { Text, Title } = Typography;

const InterviewHeader = ({ name, position, onComplete, onBack }) => {
    return (
        <Card>
            <div className={styles.header}>
                <Button icon={<LeftOutlined />} size="large" onClick={onBack} />
                <div className={styles.candidate}>
                    <Title level={4} style={{ marginBottom: 0 }}>
                        {name}
                    </Title>
                    <Text type="secondary">{position}</Text>
                </div>
                <Button type="primary" onClick={onComplete}>
                    Complete Interview
                </Button>
            </div>
        </Card>
    );
};

export default InterviewHeader;
