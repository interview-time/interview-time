import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Progress, Row, Space, Typography } from "antd";
import {
    getDecisionColor,
    getGroupAssessment,
    getOverallPerformanceColor,
    getOverallPerformancePercent,
} from "../../components/utils/assessment";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";
import Title from "antd/lib/typography/Title";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import {
    filterGroupsWithAssessment,
    filterGroupsWithAssessmentNotes,
    filterQuestionsWithAssessmentNotes,
} from "../../components/utils/filters";
import { CloseIcon } from "../../components/utils/icons";
import { useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTeamMembers } from "../../store/user/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { connect } from "react-redux";
import Spinner from "../../components/spinner/spinner";
import Paragraph from "antd/lib/typography/Paragraph";
import ExportNotes from "../../components/export-notes/export-notes";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Card from "../../components/card/card";
import { CandidateInfoSection, InterviewInfoSection } from "./interview-sections";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import QuestionDifficultyTag from "../../components/tags/question-difficulty-tag";
import { selectCandidate } from "../../store/candidates/selector";
import { selectInterview } from "../../store/interviews/selector";
import QuestionDifficultyChart from "../../components/charts/question-difficulty-chart";
import QuestionAnswersChart from "../../components/charts/question-answers-chart";
import CompetenceAreaChart from "../../components/charts/competence-area-chart";

const { Text } = Typography;

/**
 *
 * @param {Interview[]} interviews
 * @param {TeamMember[]} teamMembers
 * @param {Candidate} candidate
 * @param loadInterviews
 * @param loadTeamMembers
 * @param loadCandidates
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewReport = ({ interview, teamMembers, candidate, loadInterviews, loadTeamMembers, loadCandidates }) => {
    const [expanded, setExpanded] = useState(false);
    const [showExportNotes, setShowExportNotes] = useState(false);

    const history = useHistory();

    useEffect(() => {
        // initial data loading
        if (interview) {
            loadTeamMembers(interview.teamId);
        }
        // eslint-disable-next-line
    }, [interview]);

    useEffect(() => {
        loadInterviews();
        loadCandidates();
        // eslint-disable-next-line
    }, []);

    const onExpandClicked = () => setExpanded(true);

    const onCollapseClicked = () => setExpanded(false);

    const onExportClicked = () => {
        setShowExportNotes(true);
    };

    const ChartsSection = () => {
        let groups = filterGroupsWithAssessment(interview.structure.groups);
        return (
            groups.length > 0 && (
                <Row gutter={24} style={{ paddingTop: 30 }}>
                    <Col span={8}>
                        <Card withPadding={false}>
                            <CompetenceAreaChart groups={groups} />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card withPadding={false}>
                            <QuestionDifficultyChart groups={groups} />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card withPadding={false}>
                            <QuestionAnswersChart groups={groups} />
                        </Card>
                    </Col>
                </Row>
            )
        );
    };

    return interview && teamMembers && teamMembers.length > 0 ? (
        <div className={styles.rootContainer}>
            <Header
                title={candidate?.candidateName ?? interview.candidate}
                subtitle={interview.position}
                leftComponent={<Button icon={<CloseIcon />} size='large' onClick={() => history.goBack()} />}
                rightComponent={
                    <Space size={16}>
                        <InterviewStatusTag
                            interviewStartDateTime={new Date(interview.interviewDateTime)}
                            status={interview.status}
                        />
                        <Button onClick={onExportClicked}>Export</Button>
                    </Space>
                }
            />

            <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
                <div className={styles.divVerticalCenter} style={{ paddingTop: 60 }}>
                    <Card
                        className={styles.decisionCard}
                        style={{ borderColor: getDecisionColor(interview.decision), width: "100%" }}
                    >
                        <div className={styles.decisionTextHolder}>
                            <Title level={4} style={{ margin: "0 10px 0 0" }}>
                                🎉 {candidate?.candidateName ?? interview.candidate} scored a
                            </Title>

                            <InterviewDecisionTag decision={interview.decision} />
                        </div>
                    </Card>
                </div>

                <div className={styles.reportInterviewInfoHolder} style={{ paddingTop: 30, paddingBottom: 30 }}>
                    <InterviewInfoSection interview={interview} teamMembers={teamMembers} />
                    <div className={styles.reportInterviewCenter}>
                        {getOverallPerformancePercent(interview.structure.groups) > 0 && (
                            <Progress
                                type='circle'
                                status='active'
                                strokeLinecap='square'
                                trailColor='#E5E7EB'
                                width={160}
                                strokeWidth={8}
                                strokeColor={getOverallPerformanceColor(interview.structure.groups)}
                                percent={getOverallPerformancePercent(interview.structure.groups)}
                                format={percent => {
                                    return (
                                        <div className={styles.scoreHolder}>
                                            <Text className={styles.scoreText}>{percent}</Text>
                                            <Text className={styles.scoreLabel} type='secondary'>
                                                Score
                                            </Text>
                                        </div>
                                    );
                                }}
                            />
                        )}
                    </div>
                    <CandidateInfoSection className={styles.reportInterviewRight} candidate={candidate} />
                </div>
                <Card withPadding={false}>
                    <div className={styles.divSpaceBetween} style={{ padding: 24 }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Competence areas
                        </Title>
                        {!expanded && <Button onClick={onExpandClicked}>Expand</Button>}
                        {expanded && <Button onClick={onCollapseClicked}>Collapse</Button>}
                    </div>
                    {filterGroupsWithAssessmentNotes(interview.structure.groups)
                        .map(group => ({
                            group: group,
                            assessment: getGroupAssessment(group.questions),
                        }))
                        .map(({ assessment, group }) => (
                            <>
                                <div className={styles.divider} />
                                <div
                                    className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}
                                    style={{ backgroundColor: expanded ? "#F9FAFB" : "#FFFFFF" }}
                                >
                                    <Text strong>{group.name}</Text>
                                    <div className={styles.divHorizontalCenter}>
                                        <Text type='secondary' style={{ marginRight: 12 }}>
                                            {assessment.text}
                                        </Text>
                                        <Progress
                                            type='line'
                                            status='active'
                                            strokeLinecap='square'
                                            strokeColor={assessment.color}
                                            trailColor='#E5E7EB'
                                            steps={10}
                                            strokeWidth={16}
                                            percent={assessment.score}
                                            format={percent => <Text type='secondary'>{percent}%</Text>}
                                        />
                                    </div>
                                </div>
                                {expanded &&
                                    filterQuestionsWithAssessmentNotes(group).map(question => (
                                        <>
                                            <div className={styles.divider} />
                                            <div className={styles.questionAreaRow}>
                                                <QuestionDifficultyTag difficulty={question.difficulty} />
                                                <div className={styles.questionHolder}>
                                                    <Text>{question.question}</Text>
                                                    <Text className={styles.questionNotes} type='secondary'>
                                                        {question.notes}
                                                    </Text>
                                                </div>
                                                <AssessmentCheckbox
                                                    defaultValue={question.assessment}
                                                    disabled={true}
                                                />
                                            </div>
                                        </>
                                    ))}
                            </>
                        ))}
                </Card>

                {ChartsSection()}

                <div className={styles.divVerticalCenter} style={{ paddingTop: 30, paddingBottom: 30 }}>
                    <Card withPadding={false} style={{ width: "100%" }}>
                        <Title level={4} style={{ margin: 24 }}>
                            Summary notes
                        </Title>
                        <div className={styles.divider} />
                        <Paragraph className={styles.notesTextArea}>
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

const mapState = (state, ownProps) => {
    const interviewsState = state.interviews || {};
    const userState = state.user || {};
    const candidatesState = state.candidates || {};

    const interview = selectInterview(interviewsState, ownProps.match.params.id);
    const candidate = selectCandidate(candidatesState, interview?.candidateId);

    return {
        interview: interview,
        teamMembers: userState.teamMembers,
        candidate: candidate,
    };
};

export default connect(mapState, mapDispatch)(InterviewReport);
