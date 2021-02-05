import React, { useState } from 'react';
import { Col, Row } from "antd";
import GuideQuestionGroupCard from "./guide-question-group-card";
import GuideQuestionBankCard from "../../components/guide/guide-question-bank-card";

const GuideQuestions = ({ group, questions, categories, onGroupQuestionsChange }) => {

    const [groupQuestions, setGroupQuestions] = useState()

    React.useEffect(() => {
        // load group related questions
        if (questions.length !== 0 && !groupQuestions) {
            setGroupQuestions(
                group.questions.map(questionId => questions.find(item => item.questionId === questionId))
            )
        }
        // eslint-disable-next-line
    }, [questions]);

    const onRemoveQuestionClicked = (question) => {
        const questions = groupQuestions.filter(element => element.questionId !== question.questionId);
        setGroupQuestions(questions)
        onGroupQuestionsChange(questions)
    }

    const onAddQuestionClicked = (question) => {
        const questions = [...groupQuestions, question];
        setGroupQuestions(questions)
        onGroupQuestionsChange(questions)
    }

    return <Row style={{height: '100%'}}>
        <Col span={12}>
            <GuideQuestionGroupCard
                group={group}
                groupQuestions={groupQuestions}
                onRemoveQuestionClicked={onRemoveQuestionClicked} />
        </Col>
        <Col span={12}>
            <GuideQuestionBankCard
                questions={questions}
                categories={categories}
                groupQuestions={groupQuestions}
                onAddQuestionClicked={onAddQuestionClicked} />
        </Col>
    </Row>
}

export default GuideQuestions;