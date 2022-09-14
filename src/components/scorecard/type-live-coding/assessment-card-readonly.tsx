import { InterviewQuestion } from "../../../store/models";
import React from "react";
import AssessmentCard from "./assessment-card";

type Props = {
    questions: Readonly<InterviewQuestion[]>;
};

const LiveCodingAssessmentCard = ({ questions }: Props) => {
    const interviewQuestions: InterviewQuestion[] = questions.map((question: InterviewQuestion, index: number) => ({
        ...question,
        key: index,
    }));

    return (
        <AssessmentCard
            questions={interviewQuestions}
            description='Candidates code evaluation based on assessment criteria.'
            disabled={true}
        />
    );
};

export default LiveCodingAssessmentCard;
