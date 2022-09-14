import { InterviewQuestion, QuestionAssessment, TemplateQuestion } from "../../../store/models";
import React from "react";
import AssessmentCard from "./assessment-card";

type Props = {
    questions: Readonly<TemplateQuestion[]>;
};

const LiveCodingAssessmentCard = ({ questions }: Props) => {
    const interviewQuestions: InterviewQuestion[] = questions.map((question: TemplateQuestion, index: number) => ({
        ...question,
        key: index,
        assessment: QuestionAssessment.EXCELLENT,
        notes: undefined,
    }));

    return (
        <AssessmentCard
            questions={interviewQuestions}
            description="Evaluate candidates' code based on following assessment criteria."
            disabled={true}
        />
    );
};

export default LiveCodingAssessmentCard;
