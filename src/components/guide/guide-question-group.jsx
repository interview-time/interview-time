import React, { useState } from 'react';
import { Col, Row } from "antd";
import GuideQuestionGroupCard from "./guide-question-group-card";
import GuideQuestionBankCard from "./guide-question-bank-card";
import { connect } from "react-redux";
import { loadQuestionBank } from "../../store/question-bank/actions";
import Collection from "lodash/collection";

const GuideQuestionGroup = ({ group, questions, categories, loading, loadQuestionBank, onGroupQuestionsChange }) => {

    const [groupQuestions, setGroupQuestions] = useState()

    React.useEffect(() => {
        // initial question bank loading
        if (questions.length === 0 && !loading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

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

const mapStateToProps = state => {
    const { loading, categories, questions } = state.questionBank || {};

    return {
        questions: Collection.sortBy(questions, ['question']),
        categories: categories.sort(),
        loading
    };
};

export default connect(mapStateToProps, { loadQuestionBank })(GuideQuestionGroup);