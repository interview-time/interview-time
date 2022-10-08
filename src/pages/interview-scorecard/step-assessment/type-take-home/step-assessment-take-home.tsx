import styles from "../type-live-coding/step-assessment-live-coding.module.css";
import { InterviewInfo } from "../../../../components/scorecard/interview-info";
import { CandidateInfo } from "../../../../components/scorecard/candidate-info";
import Card from "../../../../components/card/card";
import { IntroSection } from "../type-interview/interview-sections";
import React from "react";
import { Col } from "antd";
import { Candidate, Interview, QuestionAssessment, TeamMember } from "../../../../store/models";
import { ReducerAction, ReducerActionType } from "../../interview-reducer";
import { selectAssessmentGroup } from "../../../../store/interviews/selector";
import LiveCodingAssessmentCard from "../../../../components/scorecard/type-live-coding/assessment-card-editable";
import { useDebounceFn } from "ahooks";
import { DATA_CHANGE_DEBOUNCE, DATA_CHANGE_DEBOUNCE_MAX } from "../../interview-scorecard";
import TakeHomeChallengeCard from "../../../../components/scorecard/type-take-home/challenge-card-editable";

type Props = {
    interview: Readonly<Interview>;
    interviewers: Readonly<TeamMember[]>;
    candidate?: Readonly<Candidate>;
    onInterviewChange: (action: ReducerAction) => void;
}

const StepAssessmentTakeHome = ({ interview, interviewers, candidate, onInterviewChange }: Props) => {
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

    return (
        <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }} className={styles.column}>
            <div className={styles.divSpaceBetween}>
                <InterviewInfo interview={interview} interviewers={interviewers} />
                <CandidateInfo candidate={candidate} />
            </div>

            <Card>
                {/* @ts-ignore */}
                <IntroSection interview={interview} />
            </Card>

            <TakeHomeChallengeCard teamId={interview.teamId}
                                   challenge={interview.takeHomeChallenge!} />

            <LiveCodingAssessmentCard
                questions={selectAssessmentGroup(interview).questions || []}
                onQuestionNotesChanged={onQuestionNotesChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
            />
        </Col>
    );
}

export default StepAssessmentTakeHome;