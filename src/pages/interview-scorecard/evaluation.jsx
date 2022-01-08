import React from "react";
import { Button, Card, Col, Progress, Row, Space, Typography } from "antd";
import { InterviewAssessmentButtons } from "./interview-sections";
import {
    getGroupAssessmentColor,
    getGroupAssessmentPercent,
    getGroupAssessmentText,
    getOverallPerformanceColor,
    getOverallPerformancePercent,
    getQuestionsWithAssessment,
} from "../../components/utils/assessment";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";

const { Text } = Typography;

const bodyStyleCard = () => ({
    height: 220,
    overflow: "scroll",
});

const Evaluation = ({ interview, onSubmitClicked, onAssessmentChanged }) => {
    return (
        <div className={styles.rootContainer}>
            <Header
                title="Final step"
                subtitle="Submit your evaluation"
                showBackButton={false}
                rightComponent={
                    <Button type="primary" onClick={onSubmitClicked}>
                        Submit Evaluation
                    </Button>
                }
            />

            <Col span={24}
                 xl={{ span: 20, offset: 2 }}
                 xxl={{ span: 16, offset: 4 }}>

                <Row gutter={12} style={{ marginBottom: 12, marginTop: 60 }}>
                    <Col span={6}>
                        <Card title="Overall Performance" bodyStyle={bodyStyleCard()}>
                            <div className={styles.divVerticalCenter}>
                                <Progress
                                    style={{ marginBottom: 16 }}
                                    type="circle"
                                    status="active"
                                    strokeLinecap="square"
                                    strokeColor={getOverallPerformanceColor(interview.structure.groups)}
                                    percent={getOverallPerformancePercent(interview.structure.groups)}
                                />
                                <span>
                                {getQuestionsWithAssessment(interview.structure.groups).length}{" "}
                                    questions
                            </span>
                            </div>
                        </Card>
                    </Col>
                    <Col span={18}>
                        {" "}
                        <Card title="Competence Areas" bodyStyle={bodyStyleCard()}>
                            {interview.structure.groups.map((group) => (
                                <Row style={{ marginBottom: 24 }} justify="center">
                                    <Col flex="1" className={styles.divHorizontalCenter}>
                                        <span>{group.name}</span>
                                    </Col>
                                    <Col flex="1" className={styles.divHorizontalCenter}>
                                        <Progress
                                            type="line"
                                            status="active"
                                            strokeLinecap="square"
                                            strokeColor={getGroupAssessmentColor(group)}
                                            steps={10}
                                            strokeWidth={16}
                                            percent={getGroupAssessmentPercent(group)}
                                        />
                                    </Col>
                                    <Col flex="1" className={styles.divHorizontalCenter}>
                                    <span
                                        className={styles.dotSmall}
                                        style={{ backgroundColor: getGroupAssessmentColor(group) }}
                                    />
                                        <span>{getGroupAssessmentText(group)}</span>
                                    </Col>
                                </Row>
                            ))}
                        </Card>
                    </Col>
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
                                Based on the interview data, please evaluate if the candidate is
                                qualified for the position.
                            </Text>

                            <div className={styles.divSpaceBetween}>
                                <InterviewAssessmentButtons
                                    assessment={interview.decision}
                                    onAssessmentChanged={(assessment) => {
                                        onAssessmentChanged(assessment);
                                    }}
                                />
                            </div>
                        </Space>
                    </Row>
                </Card>

            </Col>
        </div>
    );
};

export default Evaluation;
