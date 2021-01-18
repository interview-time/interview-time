import React, { useState } from 'react';
import styles from "./guide-question-group.module.css";
import { Col, Row } from "antd";
import GuideQuestionGroupCard from "./guide-question-group-card";
import GuideQuestionBankCard from "./guide-question-bank-card";
import { connect } from "react-redux";
import { loadQuestionBank } from "../../store/question-bank/actions";

const GuideQuestionGroup = ({ group, questions, categories, loading, loadQuestionBank, onGroupQuestionsChange }) => {

    const [groupQuestions, setGroupQuestions] = useState([])

    React.useEffect(() => {
        if ((!questions || questions.length === 0) && !loading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (questions && groupQuestions.length === 0) {
            setGroupQuestions(
                group.questions.map(questionId => questions.find(item => item.questionId === questionId))
            )
        }
    }, [questions]);

    React.useEffect(() => {
        if(groupQuestions) {
            onGroupQuestionsChange(groupQuestions)
        }
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
            <div className={styles.questionGroupCard}>
                <GuideQuestionGroupCard
                    group={group}
                    groupQuestions={groupQuestions}
                    onQuestionsSortChange={onQuestionsSortChange}
                    onRemoveQuestionClicked={onRemoveQuestionClicked} />
            </div>
        </Col>
        <Col span={12}>
            <div className={styles.questionBankCard}>
                <GuideQuestionBankCard
                    questions={questions}
                    categories={categories}
                    groupQuestions={groupQuestions}
                    onAddQuestionClicked={onAddQuestionClicked} />
            </div>
        </Col>
    </Row>
}

const mapStateToProps = state => {
    const { loading, categories, questions } = state.questionBank || {};

    return {
        questions,
        categories,
        loading
    };
};

export default connect(mapStateToProps, { loadQuestionBank })(GuideQuestionGroup);