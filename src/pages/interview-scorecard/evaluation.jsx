import React, { useState } from "react";
import { Button, Col, Progress, Space, Tag, Typography } from "antd";
import { InterviewAssessmentButtons } from "./interview-sections";
import {
    getGroupAssessmentColor,
    getGroupAssessmentPercent,
    getGroupAssessmentText,
    getOverallPerformanceColor,
    getOverallPerformancePercent,
} from "../../components/utils/assessment";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";
import Title from "antd/lib/typography/Title";
import { Status } from "../../components/utils/constants";
import TextArea from "antd/lib/input/TextArea";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import TimeAgo from "../../components/time-ago/time-ago";
import { filterGroupsWithAssessment, filterQuestionsWithAssessment } from "../../components/utils/filters";
import { CloseIcon } from "../../components/utils/icons";
import { routeInterviews } from "../../components/utils/route";
import { useHistory } from "react-router-dom";

const { Text } = Typography;

const Evaluation = ({ interview, interviewsUploading, onSubmitClicked, onNoteChanges, onAssessmentChanged }) => {

    const [expanded, setExpanded] = useState(false)
    const history = useHistory();

    const onExpandClicked = () => setExpanded(true)

    const onCollapseClicked = () => setExpanded(false)

    return (
        <div className={styles.rootContainer}>
            <Header
                title="Final step"
                subtitle="Submit your evaluation"
                leftComponent={
                    <Space size={16}>
                        <Button
                            icon={<CloseIcon />}
                            size="large"
                            onClick={() => history.push(routeInterviews())}
                        />
                        <TimeAgo timestamp={interview.modifiedDate} saving={interviewsUploading} />
                    </Space>
                }
                rightComponent={
                    <Space size={16}>
                        <Tag className={styles.tagOrange}>Finalizing...</Tag>
                        <Button type="primary" onClick={onSubmitClicked}>
                            Submit Evaluation
                        </Button>
                    </Space>
                }
            />

            <Col span={24}
                 xl={{ span: 20, offset: 2 }}
                 xxl={{ span: 16, offset: 4 }}>
                <div className={styles.divVerticalCenter}>
                    <span className={styles.guidingLine} />
                    <Progress
                        type="circle"
                        status="active"
                        strokeLinecap="square"
                        trailColor="#E5E7EB"
                        width={160}
                        strokeWidth={8}
                        strokeColor={getOverallPerformanceColor(interview.structure.groups)}
                        percent={getOverallPerformancePercent(interview.structure.groups)}
                        format={(percent) => {
                            return <div className={styles.scoreHolder}>
                                <Text className={styles.scoreText}>{percent}</Text>
                                <Text className={styles.scoreLabel} type="secondary">Score</Text>
                            </div>
                        }}
                    />
                    <span className={styles.guidingLine} />
                </div>
                <div className={styles.card} style={{ padding: 0 }}>
                    <div className={styles.divSpaceBetween} style={{ padding: 24 }}>
                        <Title level={4} style={{ marginBottom: 0 }}>Competence areas</Title>
                        {!expanded && <Button onClick={onExpandClicked}>Expand</Button>}
                        {expanded && <Button onClick={onCollapseClicked}>Collapse</Button>}
                    </div>
                    {filterGroupsWithAssessment(interview.structure.groups)
                        .map((group) => (
                            <>
                                <div className={styles.divider} />
                                <div className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}
                                     style={{ backgroundColor: expanded ? "#F9FAFB" : "#FFFFFF" }}>
                                    <Text strong>{group.name}</Text>
                                    <div className={styles.divHorizontalCenter}>
                                        <Text type="secondary"
                                              style={{ marginRight: 12 }}>{getGroupAssessmentText(group)}</Text>
                                        <Progress
                                            type="line"
                                            status="active"
                                            strokeLinecap="square"
                                            strokeColor={getGroupAssessmentColor(group)}
                                            trailColor="#E5E7EB"
                                            steps={10}
                                            strokeWidth={16}
                                            percent={getGroupAssessmentPercent(group)}
                                            format={(percent) => <Text type="secondary">{percent}%</Text>}
                                        />
                                    </div>
                                </div>
                                {expanded && filterQuestionsWithAssessment(group)
                                    .map(question => <>
                                        <div className={styles.divider} />
                                        <div className={`${styles.competenceAreaRow} ${styles.divSpaceBetween}`}>
                                            <div className={styles.divVertical}>
                                                <Text>{question.question}</Text>
                                                <Text className={styles.questionNotes}
                                                      type="secondary">{question.notes}</Text>
                                            </div>
                                            <AssessmentCheckbox
                                                defaultValue={question.assessment}
                                                disabled={true}
                                            />
                                        </div>
                                    </>)}
                            </>
                        ))}
                </div>

                <div className={styles.divVerticalCenter}>
                    <span className={styles.guidingLine} />
                    <div className={`${styles.card} ${styles.noPaddingCard}`}>
                        <Title level={4} style={{ margin: 24 }}>Summary notes</Title>
                        <div className={styles.divider} />
                        <TextArea
                            {...(interview.status === Status.SUBMITTED ? { readonly: "true" } : {})}
                            className={`${styles.notesTextArea} fs-mask`}
                            placeholder="No summary was left, you can still add notes now"
                            bordered={false}
                            autoSize={{ minRows: 1 }}
                            onChange={onNoteChanges}
                            defaultValue={interview.notes}
                        />
                    </div>
                </div>

                <div className={styles.divVerticalCenter} style={{ marginBottom: 32 }}>
                    <span className={styles.guidingLine} />
                    <div className={`${styles.card} ${styles.noPaddingCard} ${styles.decisionCard}`}>
                        <div style={{ margin: 24 }}>
                            <Title level={4}>Submit your hiring decision</Title>
                            <Text className={styles.decisionLabel}
                                  type="secondary">Based on the interview data, please evaluate if the candidate is
                                qualified for the position.</Text>
                        </div>
                        <div className={styles.divider} />
                        <div className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}>
                            <InterviewAssessmentButtons
                                assessment={interview.decision}
                                onAssessmentChanged={(assessment) => {
                                    onAssessmentChanged(assessment);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Col>
        </div>
    );
};

export default Evaluation;
