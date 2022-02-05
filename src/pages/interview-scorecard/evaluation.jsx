import React, { useState } from "react";
import { Button, Col, Progress, Space, Typography } from "antd";
import { CandidateInfoSection, InterviewAssessmentButtons, InterviewInfoSection } from "./interview-sections";
import {
    getGroupAssessment,
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
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Card from "../../components/card/card";

const { Text } = Typography;

/**
 *
 * @param {Interview} interview
 * @param {TeamMember[]} teamMembers
 * @param {Candidate} candidate
 * @param {boolean} interviewsUploading
 * @param onEditClicked
 * @param onSubmitClicked
 * @param onNoteChanges
 * @param onAssessmentChanged
 * @returns {JSX.Element}
 * @constructor
 */
const Evaluation = ({
    interview,
    teamMembers,
    candidate,
    interviewsUploading,
    onSubmitClicked,
    onEditClicked,
    onNoteChanges,
    onAssessmentChanged
}) => {

    const [expanded, setExpanded] = useState(false)
    const history = useHistory();

    const onExpandClicked = () => setExpanded(true)

    const onCollapseClicked = () => setExpanded(false)

    return (
        <div className={styles.rootContainer}>
            <Header
                title={interview.candidate}
                subtitle={interview.position}
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
                        <InterviewStatusTag interview={interview} />
                        <Button onClick={onEditClicked}>
                            Edit
                        </Button>
                        <Button type="primary" onClick={onSubmitClicked}>
                            Submit Evaluation
                        </Button>
                    </Space>
                }
            />

            <Col span={22} offset={1}
                 xl={{ span: 20, offset: 2 }}
                 xxl={{ span: 16, offset: 4 }}>
                <div className={styles.divVerticalCenter}>
                    <span className={styles.guidingLine} />
                    <div className={styles.reportInterviewInfoHolder}>
                        <InterviewInfoSection interview={interview} teamMembers={teamMembers} />
                        <Progress
                            className={styles.reportInterviewCenter}
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
                        <CandidateInfoSection className={styles.reportInterviewRight} candidate={candidate} />
                    </div>
                    <span className={styles.guidingLine} />
                </div>
                <Card withPadding={false}>
                    <div className={styles.divSpaceBetween} style={{ padding: 24 }}>
                        <Title level={4} style={{ marginBottom: 0 }}>Competence areas</Title>
                        {!expanded && <Button onClick={onExpandClicked}>Expand</Button>}
                        {expanded && <Button onClick={onCollapseClicked}>Collapse</Button>}
                    </div>
                    {filterGroupsWithAssessment(interview.structure.groups)
                        .map(group => ({
                            group: group,
                            assessment: getGroupAssessment(group.questions)
                        }))
                        .map(({assessment, group}) => (
                            <>
                                <div className={styles.divider} />
                                <div className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}
                                     style={{ backgroundColor: expanded ? "#F9FAFB" : "#FFFFFF" }}>
                                    <Text strong>{group.name}</Text>
                                    <div className={styles.divHorizontalCenter}>
                                        <Text type="secondary"
                                              style={{ marginRight: 12 }}>{assessment.text}</Text>
                                        <Progress
                                            type="line"
                                            status="active"
                                            strokeLinecap="square"
                                            strokeColor={assessment.color}
                                            trailColor="#E5E7EB"
                                            steps={10}
                                            strokeWidth={16}
                                            percent={assessment.score}
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
                </Card>

                <div className={styles.divVerticalCenter}>
                    <span className={styles.guidingLine} />
                    <Card withPadding={false} style={{ width: '100%' }}>
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
                    </Card>
                </div>

                <div className={styles.divVerticalCenter} style={{ marginBottom: 32 }}>
                    <span className={styles.guidingLine} />
                    <Card withPadding={false} className={`${styles.decisionCard}`}>
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
                    </Card>
                </div>
            </Col>
        </div>
    );
};

export default Evaluation;
