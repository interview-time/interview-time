import React, { useState } from 'react';
import { Col, Row } from "antd";
import TemplateQuestionsGroupCard from "./template-questions-group-card";
import TemplateQuestionsBankCard from "./template-questions-bank-card";

/**
 *
 * Updates `selectedGroup.questions`.
 */
const TemplateQuestions = ({selectedGroup, questions, categories }) => {
    const emptyGroup = {
        questions: []
    }
    const [group, setGroup] = useState(emptyGroup)

    React.useEffect(() => {
        setGroup(selectedGroup)
    }, [selectedGroup]);

    const onRemoveQuestionClicked = (question) => {
        const questions = group.questions.filter(element => element.questionId !== question.questionId);
        setGroup({
            ...group,
            questions: questions
        })
        selectedGroup.questions = questions
    }

    const onAddQuestionClicked = (question) => {
        const questions = [...group.questions, question];
        setGroup({
            ...group,
            questions: questions
        })
        selectedGroup.questions = questions
    }

    return <Row style={{height: '100%'}}>
        <Col span={12}>
            <TemplateQuestionsGroupCard
                groupName={group.name}
                groupQuestions={group.questions}
                onRemoveQuestionClicked={onRemoveQuestionClicked} />
        </Col>
        <Col span={12}>
            <TemplateQuestionsBankCard
                questions={questions}
                categories={categories}
                groupQuestions={group.questions}
                onAddQuestionClicked={onAddQuestionClicked} />
        </Col>
    </Row>
}

export default TemplateQuestions;