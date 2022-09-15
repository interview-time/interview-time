import { Button, Col, Divider, Row } from "antd";
import React, { useState } from "react";

import Card from "../../components/card/card";
import Title from "antd/lib/typography/Title";
import { getApiUrl } from "../../utils/route";
import styles from "./interview-challenge-live-coding.module.css";
import { useParams } from "react-router-dom";
import { Logo } from "../../components/logo/logo";

const InterviewChallengeLiveCoding = () => {
    // @ts-ignore
    const { token } = useParams();
    const [isExpired, setIsExpired] = useState(false);

    return (
        <Row className={styles.rootContainer}>
            <Col span={24} xxl={{ span: 8, offset: 8 }} xl={{ span: 8, offset: 8 }} lg={{ span: 12, offset: 6 }}>
                <Card style={{ marginTop: 32 }}>
                    <Logo />
                    <Divider />
                    <Title level={4} style={{ marginTop: 12 }}>
                        Code Challenge
                    </Title>
                    <div style={{ marginTop: 12 }}>
                        This is a one-time link to the task file. Access to the link will expire once it's used.
                    </div>
                    <Divider />
                    <div className={styles.buttonContainer}>
                        <Button
                            type='primary'
                            disabled={isExpired}
                            onClick={() => setIsExpired(true)}
                            href={`${getApiUrl()}/challenge/${token}/download`}
                        >
                            Download Challenge
                        </Button>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default InterviewChallengeLiveCoding;
