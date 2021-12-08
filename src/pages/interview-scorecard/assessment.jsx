import React from "react";
import { Card, Button } from "antd";
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
        <div>
            <div style={{ marginBottom: 12 }}>
                <Header
                    title={interview.candidate}
                    subtitle={interview.position}
                    rightComponent={
                        <Button type="primary" onClick={onCompletedClicked}>
                            Complete Interview
                        </Button>
                    }
                />
            </div>

            <Card style={{ marginBottom: 12 }}>
                <IntroSection interview={interview} hashStyle={styles.hash} />
            </Card>

            <InterviewGroupsSection
                interview={interview}
                onQuestionNotesChanged={onQuestionNotesChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                hashStyle={styles.hash}
            />

            <Card style={{ marginTop: 12 }}>
                <SummarySection interview={interview} />
            </Card>

            <NotesSection
                notes={interview.notes}
                status={interview.status}
                onChange={onNoteChanges}
            />

            <Card style={{ marginTop: 12, marginBottom: 24 }}>
                <div className={styles.divSpaceBetween}>
                    <TimeAgo timestamp={interview.modifiedDate} saving={interviewsUploading} />
                </div>
            </Card>
        </div>
    );
};

export default Assessment;
