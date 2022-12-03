import Card from "../../../../components/card/card";
import { IntroSection } from "../type-interview/interview-sections";
import React from "react";
import { Candidate, Interview, QuestionAssessment } from "../../../../store/models";
import { ReducerAction, ReducerActionType } from "../../interview-reducer";
import { selectAssessmentGroup } from "../../../../store/interviews/selector";
import LiveCodingAssessmentCard from "../../../../components/scorecard/type-live-coding/assessment-card-editable";
import { useDebounceFn } from "ahooks";
import { DATA_CHANGE_DEBOUNCE, DATA_CHANGE_DEBOUNCE_MAX } from "../../interview-scorecard";
import TakeHomeChallengeCard from "../../../../components/scorecard/type-take-home/challenge-card-editable";

type Props = {
    interview: Readonly<Interview>;
    candidate?: Readonly<Candidate>;
    onInterviewChange: (action: ReducerAction) => void;
};

const StepAssessmentTakeHome = ({ interview, candidate, onInterviewChange }: Props) => {
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
        <>
            <Card>
                {/* @ts-ignore */}
                <IntroSection interview={interview} />
            </Card>

            <TakeHomeChallengeCard
                teamId={interview.teamId}
                interviewId={interview.interviewId}
                challenge={interview.takeHomeChallenge!}
                candidate={candidate}
            />

            <LiveCodingAssessmentCard
                questions={selectAssessmentGroup(interview).questions || []}
                onQuestionNotesChanged={onQuestionNotesChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
            />
        </>
    );
};

export default StepAssessmentTakeHome;
