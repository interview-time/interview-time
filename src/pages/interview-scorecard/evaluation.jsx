import React from "react";
import { Button, Col, Space, Typography } from "antd";
import { InterviewAssessmentButtons } from "./interview-sections";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";
import Title from "antd/lib/typography/Title";
import TimeAgo from "../../components/time-ago/time-ago";
import { CloseIcon } from "../../utils/icons";
import { routeInterviews } from "../../utils/route";
import { useHistory } from "react-router-dom";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Card from "../../components/card/card";
import { ChartsSection, CompetenceAreaSection, ScoreSection, SummaryNotes } from "./interview-report-sections";

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
    onAssessmentChanged,
}) => {
    const history = useHistory();

    return (
        <div className={styles.rootContainer}>
            <Header
                title={interview.candidate}
                subtitle={interview.position}
                leftComponent={
                    <Space size={16}>
                        <Button icon={<CloseIcon />} size='large' onClick={() => history.push(routeInterviews())} />
                        <TimeAgo timestamp={interview.modifiedDate} saving={interviewsUploading} />
                    </Space>
                }
                rightComponent={
                    <Space size={16}>
                        <InterviewStatusTag
                            interviewStartDateTime={new Date(interview.interviewDateTime)}
                            status={interview.status}
                        />
                        <Button onClick={onEditClicked}>Edit</Button>
                        <Button type='primary' onClick={onSubmitClicked}>
                            Submit Evaluation
                        </Button>
                    </Space>
                }
            />

            <Col
                span={22}
                offset={1}
                xl={{ span: 20, offset: 2 }}
                xxl={{ span: 16, offset: 4 }}
                style={{ paddingTop: 24, paddingBottom: 24 }}
            >
                <ScoreSection interview={interview} teamMembers={teamMembers} candidate={candidate} />
                <CompetenceAreaSection interview={interview} />
                <ChartsSection interview={interview} />
                <SummaryNotes interview={interview} editable={true} onNoteChanges={onNoteChanges} />

                <Card withPadding={false} className={`${styles.decisionCard}`}>
                    <div style={{ margin: 24 }}>
                        <Title level={4}>Submit your hiring decision</Title>
                        <Text className={styles.decisionLabel} type='secondary'>
                            Based on the interview data, please evaluate if the candidate is qualified for the position.
                        </Text>
                    </div>
                    <div className={styles.divider} />
                    <div className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}>
                        <InterviewAssessmentButtons
                            assessment={interview.decision}
                            onAssessmentChanged={assessment => {
                                onAssessmentChanged(assessment);
                            }}
                        />
                    </div>
                </Card>
            </Col>
        </div>
    );
};

export default Evaluation;
