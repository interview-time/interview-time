import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Space } from "antd";
import { getDecisionColor } from "../../utils/assessment";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";
import Title from "antd/lib/typography/Title";
import { CloseIcon } from "../../utils/icons";
import { useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTeamMembers } from "../../store/user/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { connect } from "react-redux";
import Spinner from "../../components/spinner/spinner";
import ExportNotes from "../../components/export-notes/export-notes";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Card from "../../components/card/card";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import { selectCandidate } from "../../store/candidates/selector";
import ShareScorecard from "./share-scorecard";
import { ChartsSection, CompetenceAreaSection, ScoreSection, SummaryNotes } from "./interview-report-sections";
import { selectInterview } from "../../store/interviews/selector";

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
const InterviewReport = ({
    interview,
    teamMembers,
    candidate,
    profile,
    loadInterviews,
    loadTeamMembers,
    loadCandidates,
}) => {
    const [showExportNotes, setShowExportNotes] = useState(false);
    const [showShareScorecard, setShowShareScorecard] = useState(false);

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

    const onExportClicked = () => {
        setShowExportNotes(true);
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

                        {profile && profile.userId === interview.userId && (
                            <Button type='primary' onClick={() => setShowShareScorecard(true)}>
                                Share
                            </Button>
                        )}
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

                <ScoreSection interview={interview} teamMembers={teamMembers} candidate={candidate} />
                <CompetenceAreaSection interview={interview} />
                <ChartsSection interview={interview} />
                <SummaryNotes interview={interview} />
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
            {profile && profile.userId === interview.userId && (
                <ShareScorecard
                    interviewId={interview.interviewId}
                    visible={showShareScorecard}
                    onClose={() => setShowShareScorecard(false)}
                />
            )}
        </div>
    ) : (
        <Spinner />
    );
};

const mapDispatch = { loadInterviews, loadTeamMembers, loadCandidates };

const mapState = (state, ownProps) => {
    const userState = state.user || {};

    const interview = selectInterview(state, ownProps.match.params.id);
    const candidate = selectCandidate(state, interview?.candidateId);

    return {
        interview: interview,
        teamMembers: userState.teamMembers,
        candidate: candidate,
        profile: userState.profile,
    };
};

export default connect(mapState, mapDispatch)(InterviewReport);
