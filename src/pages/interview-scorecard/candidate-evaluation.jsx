import React from "react";
import Layout from "../../components/layout/layout";
import { Button, Card, Col, Modal, Progress, Row, Space, Steps } from "antd";

const CandidateEvaluation = () => {
    return (
        <Layout>
            <Row className={styles.rootContainer}>
                <Col span={24} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
                    <div>
                        <div style={{ marginBottom: 12 }}>
                            <InterviewInformationSection
                                title="Candidate Evaluation"
                                interview={interview}
                            />
                        </div>

                        <Row gutter={12} style={{ marginBottom: 12 }}>
                            <Col span={6}>{OverallPerformanceCard()}</Col>
                            <Col span={18}>{CompetenceAreaCard()}</Col>
                        </Row>

                        <Card title="Notes" style={{ marginBottom: 12 }}>
                            <span className="fs-mask">
                                {interview.notes && interview.notes.length > 0
                                    ? interview.notes
                                    : "There are no notes."}
                            </span>
                        </Card>

                        <Card style={{ marginBottom: 24 }}>
                            <Row>
                                <Space className={styles.space} direction="vertical">
                                    <Text strong>Ready to make hiring recommendation?</Text>
                                    <Text>
                                        Based on the interview data, please evaluate if the
                                        candidate is qualified for the position.
                                    </Text>

                                    <div className={styles.divSpaceBetween}>
                                        <InterviewAssessmentButtons
                                            assessment={interview.decision}
                                            disabled={isCompletedStatus()}
                                            onAssessmentChanged={(assessment) => {
                                                onAssessmentChanged(assessment);
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            onClick={onSubmitClicked}
                                            disabled={isCompletedStatus()}
                                        >
                                            Submit Evaluation
                                        </Button>
                                    </div>
                                </Space>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Layout>
    );
};

export default CandidateEvaluation;
