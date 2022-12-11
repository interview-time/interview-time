import { ArrowLeftOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import { Typography } from "antd";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import Layout from "../../components/layout/layout";
import InterviewSchedule from "./interview-schedule";
import styles from "./interview-schedule.module.css";
import { routeInterviews } from "../../utils/route";

const { Title } = Typography;

const InterviewSchedulePage = () => {
    const history = useHistory();
    const { id } = useParams<Record<string, string | undefined>>();

    const marginTop12 = { marginTop: 12 };

    return (
        // @ts-ignore
        <Layout contentStyle={styles.rootContainer}>
            <Row>
                <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                    <Card style={marginTop12} key={id}>
                        <div className={styles.header} style={{ marginBottom: 12 }}>
                            <div className={styles.headerTitleContainer} onClick={() => history.goBack()}>
                                <ArrowLeftOutlined />
                                <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                                    Schedule Interview
                                </Title>
                            </div>
                        </div>

                        {/* @ts-ignore */}
                        <InterviewSchedule interviewId={id} onScheduled={() => history.push(routeInterviews())} />
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default InterviewSchedulePage;
