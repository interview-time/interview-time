import React from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { loadQuestionBank, deleteQuestion } from "../../store/question-bank/actions";
import { Table, Tag, Space, Row, Col, Card, Select, PageHeader } from 'antd';
import AddQuestion from "../../components/add-question/add-question";
import { getQuestions } from "../../store/question-bank/selector";
import styles from "./question-bank.module.css";

const columns = [
    {
        title: 'Question',
        dataIndex: 'question',
        key: 'questions',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags && tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
];

const QuestionBank = ({ questions, loading, loadQuestionBank, deleteQuestion }) => {

    React.useEffect(() => {

        if ((!questions || questions.length === 0) && !loading) {
            loadQuestionBank();
        }
    }, []);

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Question Bank"
        />}>
            <AddQuestion />

            <Row gutter={16}>
                <Col span={24}>
                    <Table columns={columns} dataSource={questions} loading={loading} />
                </Col>
            </Row>

        </Layout>
    )
}

const mapStateToProps = state => {
    const { loading, questions } = state.questionBank || {};

    return {
        questions, //: getQuestions(state),
        loading
    };
};

export default connect(mapStateToProps, { loadQuestionBank, deleteQuestion })(QuestionBank);