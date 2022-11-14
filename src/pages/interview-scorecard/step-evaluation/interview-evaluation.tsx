import React from "react";
import { Typography } from "antd";
import { InterviewAssessmentButtons } from "../step-assessment/type-interview/interview-sections";
import styles from "./interview-evaluation.module.css";
import Title from "antd/lib/typography/Title";
import Card from "../../../components/card/card";
import { Interview, InterviewAssessment, TeamMember } from "../../../store/models";
import { ReducerAction, ReducerActionType } from "../interview-reducer";
import { useDebounceFn } from "ahooks";
import { DATA_CHANGE_DEBOUNCE, DATA_CHANGE_DEBOUNCE_MAX } from "../interview-scorecard";
import ScorecardReportSection from "../../../components/scorecard/scorecard-report-section";

const { Text } = Typography;

type Props = {
    interview: Readonly<Interview>;
    interviewers: Readonly<TeamMember[]>;
    onInterviewChange: (action: ReducerAction) => void;
};

const InterviewEvaluation = ({ interview, interviewers, onInterviewChange }: Props) => {
    const onAssessmentChanged = (assessment: InterviewAssessment) => {
        onInterviewChange({
            type: ReducerActionType.UPDATE_ASSESSMENT,
            assessment: assessment,
        });
    };

    const onNotesChangeDebounce = useDebounceFn(
        (text: string) => {
            onInterviewChange({
                type: ReducerActionType.UPDATE_NOTES,
                notes: text,
            });
        },
        {
            wait: DATA_CHANGE_DEBOUNCE,
            maxWait: DATA_CHANGE_DEBOUNCE_MAX,
        }
    );

    const onNotesChange = (text: string) => onNotesChangeDebounce.run(text);

    const onRedFlagsChange = (flags: string[]) =>
        onInterviewChange({
            type: ReducerActionType.SET_RED_FLAGS,
            redFlags: flags.map((label, index) => ({
                order: index,
                label: label,
            })),
        });

    return (
        <ScorecardReportSection
            interview={interview}
            interviewers={interviewers}
            onNotesChange={onNotesChange}
            onRedFlagsChange={onRedFlagsChange}
            footer={
                <Card withPadding={false} className={`${styles.decisionCard}`}>
                    <div style={{ margin: 24 }}>
                        <Title level={4}>Submit your hiring decision</Title>
                        <Text className={styles.decisionLabel} type='secondary'>
                            Based on the interview data, please evaluate if the candidate is qualified for the position.
                        </Text>
                    </div>
                    <div className={styles.divider} />
                    <div className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}>
                        {/* @ts-ignore */}
                        <InterviewAssessmentButtons
                            assessment={interview.decision}
                            onAssessmentChanged={(assessment: InterviewAssessment) => {
                                onAssessmentChanged(assessment);
                            }}
                        />
                    </div>
                </Card>
            }
        />
    );
};

export default InterviewEvaluation;
