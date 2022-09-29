import React from "react";
import { Col } from "antd";
import { InterviewGroupsSection, IntroSection } from "./interview-sections";
import styles from "./step-assessment-interview.module.css";
import Card from "../../../../components/card/card";
import {
    Candidate,
    Interview,
    InterviewStructureGroup,
    QuestionAssessment,
    TeamMember,
} from "../../../../store/models";
import { ReducerAction, ReducerActionType } from "../../interview-reducer";
import { useDebounceFn } from "ahooks";
import { DATA_CHANGE_DEBOUNCE, DATA_CHANGE_DEBOUNCE_MAX } from "../../interview-scorecard";
import { InterviewInfo } from "../../../../components/scorecard/interview-info";
import { CandidateInfo } from "../../../../components/scorecard/candidate-info";

type Props = {
    interview: Readonly<Interview>;
    teamMembers: Readonly<TeamMember[]>;
    candidate?: Readonly<Candidate>;
    onInterviewChange: (action: ReducerAction) => void;
};

const StepAssessmentInterview = ({ interview, teamMembers, candidate, onInterviewChange }: Props) => {
    const onNotesChangeDebounce = useDebounceFn(
        (questionId: string, notes: string) => {
            onInterviewChange({
                type: ReducerActionType.UPDATE_QUESTION_NOTES,
                questionId,
                notes,
            });
        },
        {
            wait: DATA_CHANGE_DEBOUNCE,
            maxWait: DATA_CHANGE_DEBOUNCE_MAX,
        }
    );

    const onQuestionNotesChanged = (questionId: string, notes: string) => onNotesChangeDebounce.run(questionId, notes);

    const onQuestionAssessmentChanged = (questionId: string, assessment: QuestionAssessment) => {
        onInterviewChange({
            type: ReducerActionType.UPDATE_QUESTION_ASSESSMENT,
            questionId,
            assessment,
        });
    };

    const onQuestionsRemoved = (group: InterviewStructureGroup) => {
        onInterviewChange({
            type: ReducerActionType.REMOVE_QUESTIONS,
            groupId: group.groupId,
        });
    };

    return (
        <Col
            span={22}
            offset={1}
            xl={{ span: 20, offset: 2 }}
            xxl={{ span: 16, offset: 4 }}
            className={styles.interviewSectionContainer}
        >
            <div className={styles.divSpaceBetween} style={{ marginTop: 32 }}>
                <InterviewInfo interview={interview} interviewers={teamMembers} />
                <CandidateInfo candidate={candidate} />
            </div>

            <Card style={{ marginTop: 32 }}>
                {/* @ts-ignore */}
                <IntroSection interview={interview} />
            </Card>

            {/* @ts-ignore */}
            <InterviewGroupsSection
                interview={interview}
                onQuestionNotesChanged={onQuestionNotesChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                onRemoveGroupClicked={onQuestionsRemoved}
            />
        </Col>
    );
};

export default StepAssessmentInterview;
