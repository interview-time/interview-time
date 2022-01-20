import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Progress, Space, Typography } from "antd";
import {
    getDecisionColor,
    getGroupAssessmentColor,
    getGroupAssessmentPercent,
    getGroupAssessmentText,
    getOverallPerformanceColor,
    getOverallPerformancePercent,
} from "../../components/utils/assessment";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";
import Title from "antd/lib/typography/Title";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import { filterGroupsWithAssessment, filterQuestionsWithAssessment } from "../../components/utils/filters";
import { CloseIcon } from "../../components/utils/icons";
import { useHistory, useParams } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTeamMembers } from "../../store/user/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { connect } from "react-redux";
import { findInterview } from "../../components/utils/converters";
import Spinner from "../../components/spinner/spinner";
import Paragraph from "antd/lib/typography/Paragraph";
import ExportNotes from "../../components/export-notes/export-notes";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Card from "../../components/card/card";
import { CandidateInfoSection, InterviewInfoSection } from "./interview-sections";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";

const { Text } = Typography;

/**
 *
 * @param {Interview[]} interviews
 * @param {TeamMember[]} teamMembers
 * @param {Candidate[]} candidates
 * @param loadInterviews
 * @param loadTeamMembers
 * @param loadCandidates
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewReport = ({
    interviews,
    teamMembers,
    candidates,
    loadInterviews,
    loadTeamMembers,
    loadCandidates
}) => {

    const [interview, setInterview] = useState(/** @type {Interview|undefined} */undefined);
    const [expanded, setExpanded] = useState(false)
    const [showExportNotes, setShowExportNotes] = useState(false);

    const { id } = useParams();

    const history = useHistory();

    useEffect(() => {
        // initial data loading
        if (interviews.length > 0 && !interview) {
            const currentInterview = findInterview(id, interviews);
            setInterview(currentInterview);
            loadTeamMembers(currentInterview.teamId)
        }
        // eslint-disable-next-line
    }, [interviews]);

    useEffect(() => {
        loadInterviews();
        loadCandidates();
        // eslint-disable-next-line
    }, []);

    const onExpandClicked = () => setExpanded(true)

    const onCollapseClicked = () => setExpanded(false)

    const getInterviewerName = () => {
        return teamMembers && teamMembers.length > 0
            ? teamMembers.find(member => member.userId === interview.userId).name : "";
    }

    const onExportClicked = () => {
        setShowExportNotes(true)
    }

    const getCandidate = () => interview && candidates ?
        candidates.find(candidate => candidate.candidateId === interview.candidateId) : undefined

    return interview ? (
        <div className={styles.rootContainer}>
            <Header
                title={interview.candidate}
                subtitle={interview.position}
                leftComponent={
                    <Button
                        icon={<CloseIcon />}
                        size="large"
                        onClick={() => history.goBack()}
                    />
                }
                rightComponent={
                    <Space size={16}>
                        <InterviewStatusTag interview={interview} />
                        <Button onClick={onExportClicked}>
                            Export
                        </Button>
                    </Space>
                }
            />

            <Col span={22} offset={1}
                 xl={{ span: 20, offset: 2 }}
                 xxl={{ span: 16, offset: 4 }}>
                <div className={styles.divVerticalCenter} style={{ paddingTop: 60 }}>
                    <Card className={styles.decisionCard}
                          style={{ borderColor: getDecisionColor(interview.decision), width: '100%' }}>
                        <div className={styles.decisionTextHolder}>
                            <Title level={4} style={{ margin: 0 }}>🎉 {getInterviewerName()} scored a...</Title>
                            <InterviewDecisionTag decision={interview.decision} />
                        </div>
                    </Card>
                </div>

                <div className={styles.reportInterviewInfoHolder} style={{ paddingTop: 30, paddingBottom: 30 }}>
                    <InterviewInfoSection interview={interview} teamMembers={teamMembers} />
                    <div className={styles.reportInterviewCenter}>
                        {getOverallPerformancePercent(interview.structure.groups) > 0 && <Progress
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
                        />}
                    </div>
                    <CandidateInfoSection className={styles.reportInterviewRight} candidate={getCandidate()} />
                </div>
                <Card withPadding={false}>
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
                </Card>

                <div className={styles.divVerticalCenter} style={{ paddingTop: 30, paddingBottom: 30 }}>
                    <Card withPadding={false} style={{ width: '100%' }}>
                        <Title level={4} style={{ margin: 24 }}>Summary notes</Title>
                        <div className={styles.divider} />
                        <Paragraph className={`${styles.notesTextArea} fs-mask`}>
                            {interview.notes ? interview.notes : "No summary was left"}
                        </Paragraph>
                    </Card>
                </div>
            </Col>
            <Modal
                visible={showExportNotes}
                title={`Export Notes - ${interview.candidate}`}
                onCancel={() => setShowExportNotes(false)}
                footer={null}
                width={600}
            >
                <ExportNotes interview={interview} />
            </Modal>
        </div>
    ) : (
        <Spinner />
    );
};

const mapDispatch = { loadInterviews, loadTeamMembers, loadCandidates };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const userState = state.user || {};
    const candidatesState = state.candidates || {};
    return {
        interviews: interviewsState.interviews,
        teamMembers: userState.teamMembers,
        candidates: candidatesState.candidates,
    };
};

export default connect(mapState, mapDispatch)(InterviewReport);
