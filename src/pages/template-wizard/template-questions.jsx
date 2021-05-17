import React, { useState } from 'react';
import { Col, Row } from "antd";
import styles from "./template-questions.module.css";
import TemplateQuestionsGroupCard from "./template-questions-group-card";
import TemplateQuestionsBankCard from "./template-questions-bank-card";

/**
 *
 * Updates `selectedGroup.questions`.
 */
const TemplateQuestions = ({selectedGroup, categories, onDoneClicked }) => {
    const emptyGroup = {
        questions: []
    }
    const [group, setGroup] = useState(emptyGroup)

    React.useEffect(() => {
        setGroup(selectedGroup)
    }, [selectedGroup]);

    const onQuestionsSortChange = (questions) => {
        setGroup({
            ...group,
            questions: questions
        })
        selectedGroup.questions = questions
    }

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

    return <Row className={styles.rootContainer}>
        <Col span={12}>
            <TemplateQuestionsGroupCard
                groupName={group.name}
                groupQuestions={group.questions}
                onDoneClicked={onDoneClicked}
                onQuestionsSortChange={onQuestionsSortChange}
                onRemoveQuestionClicked={onRemoveQuestionClicked} />
        </Col>
        <Col span={12}>
            <TemplateQuestionsBankCard
                categories={categories}
                groupQuestions={group.questions}
                onAddQuestionClicked={onAddQuestionClicked} />
        </Col>
    </Row>
}

export default TemplateQuestions;