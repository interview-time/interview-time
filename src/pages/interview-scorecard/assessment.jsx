import React from "react";
import { Button, Col, Space } from "antd";
import { InterviewGroupsSection, IntroSection, SummarySection } from "./interview-sections";
import NotesSection from "./notes-section";
import TimeAgo from "../../components/time-ago/time-ago";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";

const Assessment = ({
    interview,
    onCompletedClicked,
    onQuestionNotesChanged,
    onQuestionAssessmentChanged,
    onNoteChanges,
    interviewsUploading,
}) => {

    return (
        <div className={styles.rootContainer}>
            <Header
                title={interview.candidate}
                subtitle={interview.position}
                rightComponent={
                    <Space>
                        <TimeAgo timestamp={interview.modifiedDate} saving={interviewsUploading} />
                        <Button type="primary" onClick={onCompletedClicked}>
                            Complete Interview
                        </Button>
                    </Space>
                }
            />

            <Col span={24}
                 xl={{ span: 20, offset: 2 }}
                 xxl={{ span: 16, offset: 4 }}>

                <div className={styles.card}>
                    <IntroSection interview={interview} hashStyle={styles.hash} />
                </div>

                <InterviewGroupsSection
                    interview={interview}
                    onQuestionNotesChanged={onQuestionNotesChanged}
                    onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                    hashStyle={styles.hash}
                />

                <div className={styles.card} style={{ marginBottom: 32 }}>
                    <SummarySection interview={interview} />
                </div>

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
