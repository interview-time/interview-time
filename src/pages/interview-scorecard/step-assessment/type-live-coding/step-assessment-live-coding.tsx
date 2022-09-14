import { Candidate, Interview, QuestionAssessment, TeamMember } from "../../../../store/models";
import { ReducerAction, ReducerActionType } from "../../interview-reducer";
import styles from "./step-assessment-live-coding.module.css";
import { Col } from "antd";
import {
    IntroSection,
    SummarySection,
} from "../type-interview/interview-sections";
import React from "react";
import Card from "../../../../components/card/card";
import LiveCodingChallengeCard from "../../../../components/scorecard/type-live-coding/challenge-card-editable";
import { selectAssessmentGroup } from "../../../../store/interviews/selector";
import { useDebounceFn } from "ahooks";
import { DATA_CHANGE_DEBOUNCE, DATA_CHANGE_DEBOUNCE_MAX } from "../../interview-scorecard";
import LiveCodingAssessmentCard from "../../../../components/scorecard/type-live-coding/assessment-card-editable";
import { InterviewInfo } from "../../../../components/scorecard/interview-info";
import { CandidateInfo } from "../../../../components/scorecard/candidate-info";

type Props = {
    interview: Readonly<Interview>;
    interviewers: Readonly<TeamMember[]>;
    candidate?: Readonly<Candidate>;
    onInterviewChange: (action: ReducerAction) => void;
};

const StepAssessmentLiveCoding = ({ interview, interviewers, candidate, onInterviewChange }: Props) => {
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

    const onChallengeSelected = (challengeId?: string) => {
        onInterviewChange({
            type: ReducerActionType.UPDATE_CHALLENGE,
            challengeDetails: challengeId
                ? {
                      challengeId: challengeId,
                  }
                : undefined,
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

            <LiveCodingChallengeCard
                challenges={interview.challenges || []}
                interviewId={interview.interviewId}
                teamId={interview.teamId}
                selectedChallengeId={interview.challengeDetails?.challengeId}
                onChallengeSelected={onChallengeSelected}
            />

            <LiveCodingAssessmentCard
                questions={selectAssessmentGroup(interview).questions || []}
                onQuestionNotesChanged={onQuestionNotesChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
            />

            <Card>
                {/* @ts-ignore */}
                <SummarySection interview={interview} />
            </Card>
        </Col>
    );
};

export default StepAssessmentLiveCoding;
