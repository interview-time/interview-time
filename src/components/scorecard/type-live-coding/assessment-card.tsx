import { InterviewQuestion, QuestionAssessment } from "../../../store/models";
import { ColumnsType } from "antd/lib/table";
import styles from "./assessment-card.module.css";
import AssessmentCheckbox from "../../questions/assessment-checkbox";
import React from "react";
import Card from "../../card/card";
import { Typography } from "antd";
import { Table } from "antd";
import { expandableNotes } from "../../../pages/interview-scorecard/interview-scorecard-utils";
const { Title, Text } = Typography;

type Props = {
    questions: InterviewQuestion[];
    description: string;
    disabled: boolean;
    onQuestionNotesChanged?: (questionId: string, notes: string) => void;
    onQuestionAssessmentChanged?: (questionId: string, assessment: QuestionAssessment) => void;
};

export const AssessmentCard = ({
    questions,
    description,
    disabled,
    onQuestionAssessmentChanged,
    onQuestionNotesChanged,
}: Props) => {
    let columns: ColumnsType<InterviewQuestion> = [
        {
            key: "question",
            render: question => <Text>{question.question}</Text>,
        },
        {
            key: "assessment",
            width: 120,
            render: question => (
                // @ts-ignore
                <AssessmentCheckbox
                    defaultValue={question.assessment}
                    hideNoAssessment={true}
                    disabled={disabled}
                    onChange={(assessment: QuestionAssessment) => {
                        onQuestionAssessmentChanged?.(question.questionId, assessment);
                    }}
                />
            ),
            onCell: () => ({
                onClick: event => event.stopPropagation(),
            }),
        },
        {
            title: "Notes",
            dataIndex: "",
            key: "notes",
            width: 48,
        },
    ];

    return (
        <Card>
            <Title level={4}>Assessment</Title>
            <Text type='secondary'>{description}</Text>
            <div className={styles.assessmentCard}>
                <Table
                    rowClassName='assessment-question-row'
                    pagination={false}
                    showHeader={false}
                    scroll={{
                        x: "max-content",
                    }}
                    dataSource={questions}
                    columns={columns}
                    expandable={expandableNotes(questions, onQuestionNotesChanged)}
                />
            </div>
        </Card>
    );
};

export default AssessmentCard;
