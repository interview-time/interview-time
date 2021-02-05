import React, { useState } from 'react';
import { Col, Row } from "antd";
import GuideQuestionGroupCard from "../../components/guide/guide-question-group-card";
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

    React.useEffect(() => {
        // propagate group question changes to upper component
        if (groupQuestions) {
            onGroupQuestionsChange(groupQuestions)
        }
        // eslint-disable-next-line
    }, [groupQuestions]);

    const onQuestionsSortChange = (groupQuestions) => {
        setGroupQuestions(groupQuestions)
    }

    const onRemoveQuestionClicked = (question) => {
        setGroupQuestions(groupQuestions.filter(element => element.questionId !== question.questionId))
    }

    const onAddQuestionClicked = (question) => {
        setGroupQuestions([...groupQuestions, question])
    }

    return <Row>
        <Col span={12}>
            <div>
                <GuideQuestionGroupCard
                    group={group}
                    groupQuestions={groupQuestions}
                    onQuestionsSortChange={onQuestionsSortChange}
                    onRemoveQuestionClicked={onRemoveQuestionClicked} />
            </div>
        </Col>
        <Col span={12}>
            <div>
                <GuideQuestionBankCard
                    questions={questions}
                    categories={categories}
                    groupQuestions={groupQuestions}
                    onAddQuestionClicked={onAddQuestionClicked} />
            </div>
        </Col>
    </Row>
}

export default GuideQuestions;