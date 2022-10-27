import { Interview, LiveCodingChallenge, QuestionAssessment } from "../../../../store/models";
import { ReducerAction, ReducerActionType } from "../../interview-reducer";
import { IntroSection } from "../type-interview/interview-sections";
import React from "react";
import Card from "../../../../components/card/card";
import LiveCodingChallengeCard from "../../../../components/scorecard/type-live-coding/challenge-card-editable";
import { selectAssessmentGroup } from "../../../../store/interviews/selector";
import { useDebounceFn } from "ahooks";
import { DATA_CHANGE_DEBOUNCE, DATA_CHANGE_DEBOUNCE_MAX } from "../../interview-scorecard";
import LiveCodingAssessmentCard from "../../../../components/scorecard/type-live-coding/assessment-card-editable";

type Props = {
    interview: Readonly<Interview>;
    onInterviewChange: (action: ReducerAction) => void;
};

const StepAssessmentLiveCoding = ({ interview, onInterviewChange }: Props) => {
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

    const onChallengeSelectionChanged = (selected: boolean, challenge: LiveCodingChallenge) => {
        onInterviewChange({
            type: ReducerActionType.UPDATE_SELECTED_LIVE_CODING_CHALLENGE,
            challengeId: challenge.challengeId,
            selected: selected,
        });
    };

    return (
        <>
            <Card>
                {/* @ts-ignore */}
                <IntroSection interview={interview} />
            </Card>

            <LiveCodingChallengeCard
                challenges={interview.liveCodingChallenges || []}
                interviewId={interview.interviewId}
                teamId={interview.teamId}
                onChallengeSelectionChanged={onChallengeSelectionChanged}
            />

            <LiveCodingAssessmentCard
                questions={selectAssessmentGroup(interview).questions || []}
                onQuestionNotesChanged={onQuestionNotesChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
            />
        </>
    );
};

export default StepAssessmentLiveCoding;
