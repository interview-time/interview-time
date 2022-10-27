import React, { useEffect, useState } from "react";
import { Button, Modal, Space } from "antd";
import { getDecisionColor } from "../../utils/assessment";
import Header from "../../components/header/header";
import styles from "./interview-report.module.css";
import Title from "antd/lib/typography/Title";
import { CloseIcon } from "../../utils/icons";
import { Link, useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTeamMembers } from "../../store/user/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { connect } from "react-redux";
import Spinner from "../../components/spinner/spinner";
import ExportNotes from "../../components/export-notes/export-notes";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Card from "../../components/card/card";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import { getCandidateName2, selectInterviewData, toInterview } from "../../store/interviews/selector";
import { RootState } from "../../store/state-models";
import { Candidate, Interview, TeamMember } from "../../store/models";
import ScorecardReportSection from "../../components/scorecard/scorecard-report-section";
import ShareScorecard from "./share-report-modal";
import { routeCandidateDetails } from "../../utils/route";

type Props = {
    currentTeamId: string;
    interview: Readonly<Interview> | undefined;
    candidate?: Candidate;
    interviewers: TeamMember[];
    loadInterviews: Function;
    loadCandidates: Function;
    loadTeamMembers: Function;
};

const InterviewReport = ({
    currentTeamId,
    interview,
    candidate,
    interviewers,
    loadInterviews,
    loadCandidates,
    loadTeamMembers,
}: Props) => {
    const [showExportNotes, setShowExportNotes] = useState(false);
    const [showShareScorecard, setShowShareScorecard] = useState(false);

    const history = useHistory();

    useEffect(() => {
        loadInterviews();
        loadCandidates();
        loadTeamMembers(currentTeamId);
        // eslint-disable-next-line
    }, []);

    const onExportClicked = () => {
        setShowExportNotes(true);
    };

    if (!interview) {
        return <Spinner />;
    }

    return (
        <div className={styles.rootContainer}>
            <Header
                title={
                    <Link
                        to={routeCandidateDetails(candidate?.candidateId)}
                        target='_blank'
                        style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                    >
                        {getCandidateName2(interview, candidate)}
                    </Link>
                }
                subtitle={candidate?.position ?? ""}
                leftComponent={<Button icon={<CloseIcon />} size='large' onClick={() => history.goBack()} />}
                rightComponent={
                    <Space size={16}>
                        <InterviewStatusTag
                            interviewStartDateTime={new Date(interview.interviewDateTime)}
                            status={interview.status}
                        />
                        <Button onClick={onExportClicked}>Export</Button>

                        <Button type='primary' onClick={() => setShowShareScorecard(true)}>
                            Share
                        </Button>
                    </Space>
                }
            />

            <ScorecardReportSection
                interview={interview}
                interviewers={interviewers}
                header={
                    <Card
                        className={styles.decisionCard}
                        style={{ borderColor: getDecisionColor(interview.decision), width: "100%" }}
                    >
                        <div className={styles.decisionTextHolder}>
                            <Title level={4} style={{ margin: "0 10px 0 0" }}>
                                🎉 {getCandidateName2(interview, candidate)} scored a
                            </Title>

                            <InterviewDecisionTag decision={interview.decision} />
                        </div>
                    </Card>
                }
            />

            {/* @ts-ignore */}
            <Modal
                visible={showExportNotes}
                title={`Export Notes - ${getCandidateName2(interview, candidate)}`}
                onCancel={() => setShowExportNotes(false)}
                footer={null}
                width={600}
            >
                <ExportNotes interview={interview} candidate={candidate} />
            </Modal>
            <ShareScorecard
                interviewId={interview.interviewId}
                visible={showShareScorecard}
                onClose={() => setShowShareScorecard(false)}
            />
        </div>
    );
};

const mapDispatch = { loadInterviews, loadTeamMembers, loadCandidates };

const mapState = (state: RootState, ownProps: any) => {
    let interviewId = ownProps.match.params.id;
    const interviewData = selectInterviewData(state, interviewId);

    return {
        currentTeamId: state.user.profile.currentTeamId,
        interview: interviewData ? toInterview(interviewData) : undefined,
        candidate: interviewData?.candidate,
        interviewers: interviewData?.interviewersMember ?? [],
    };
};

export default connect(mapState, mapDispatch)(InterviewReport);
