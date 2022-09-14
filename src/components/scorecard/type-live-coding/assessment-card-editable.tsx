import { InterviewQuestion, QuestionAssessment } from "../../../store/models";
import React from "react";
import AssessmentCard from "./assessment-card";

type Props = {
    questions: Readonly<InterviewQuestion[]>;
    onQuestionNotesChanged: (questionId: string, notes: string) => void;
    onQuestionAssessmentChanged: (questionId: string, assessment: QuestionAssessment) => void;
};

export const LiveCodingAssessmentCard = ({ questions, onQuestionAssessmentChanged, onQuestionNotesChanged }: Props) => {
    const interviewQuestions: InterviewQuestion[] = questions.map((question: InterviewQuestion, index: number) => ({
        ...question,
        key: index,
    }));

    return (
        <AssessmentCard
            questions={interviewQuestions}
            description="Evaluate candidates' code based on following assessment criteria."
            disabled={false}
            onQuestionAssessmentChanged={onQuestionAssessmentChanged}
            onQuestionNotesChanged={onQuestionNotesChanged}
        />
    );
};

export default LiveCodingAssessmentCard;
