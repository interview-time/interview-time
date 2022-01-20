import React from "react";
import { Button, Col, Space} from "antd";
import {
    CandidateInfoSection,
    InterviewGroupsSection,
    InterviewInfoSection,
    IntroSection,
    SummarySection
} from "./interview-sections";
import NotesSection from "./notes-section";
import TimeAgo from "../../components/time-ago/time-ago";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";
import { BackIcon } from "../../components/utils/icons";
import { useHistory } from "react-router-dom";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Card from "../../components/card/card";

/**
 *
 * @param {Interview} interview
 * @param {TeamMember[]} teamMembers
 * @param {Candidate} candidate
 * @param onCompletedClicked
 * @param onQuestionNotesChanged
 * @param onQuestionAssessmentChanged
 * @param onNoteChanges
 * @param {boolean} interviewsUploading
 * @returns {JSX.Element}
 * @constructor
 */
const Assessment = ({
    interview,
    teamMembers,
    candidate,
    onCompletedClicked,
    onQuestionNotesChanged,
    onQuestionAssessmentChanged,
    onNoteChanges,
    interviewsUploading,
}) => {

    const history = useHistory();

    return (
        <div className={styles.rootContainer}>
            <Header
                title={interview.candidate}
                subtitle={interview.position}
                leftComponent={
                    <Space size={16}>
                        <Button
                            icon={<BackIcon />}
                            size="large"
                            onClick={() => history.goBack()}
                        />
                        <TimeAgo timestamp={interview.modifiedDate} saving={interviewsUploading} />
                    </Space>
                }
                rightComponent={
                    <Space size={16}>
                        <InterviewStatusTag interview={interview} />
                        <Button type="primary" onClick={onCompletedClicked}>
                            Complete Interview
                        </Button>
                    </Space>
                }
            />

            <Col span={22} offset={1}
                 xl={{ span: 20, offset: 2 }}
                 xxl={{ span: 16, offset: 4 }}>

                <div className={styles.divSpaceBetween} style={{ marginTop: 32 }}>
                    <InterviewInfoSection interview={interview} teamMembers={teamMembers} />
                    <CandidateInfoSection candidate={candidate} />
                </div>

                <Card style={{ marginTop: 32 }}>
                    <IntroSection interview={interview} hashStyle={styles.hash} />
                </Card>

                <InterviewGroupsSection
                    interview={interview}
                    onQuestionNotesChanged={onQuestionNotesChanged}
                    onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                    hashStyle={styles.hash}
                />

                <Card style={{ marginBottom: 32, marginTop: 32 }}>
                    <SummarySection interview={interview} />
                </Card>

            </Col>

            <NotesSection
                notes={interview.notes}
                status={interview.status}
                onChange={onNoteChanges}
            />
        </div>
    );
};

export default Assessment;
