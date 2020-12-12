import React from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import {loadQuestions, addQuestion, updateQuestion, deleteQuestion} from "../../store/question-bank/actions";
import { Table, Tag, Space, Row, Col, Card, Select, PageHeader } from 'antd';
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
                {tags.map(tag => {
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

const QuestionBank = ({ questions, loading, loadQuestions, addQuestion, updateQuestion, deleteQuestion }) => {

    React.useEffect(() => {
        if ((!questions || questions.length === 0) && !loading) {
            loadQuestions('JavaScript');
        }
    }, []);

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Question Bank"
        />}>
            <Row gutter={16}>
                <Col span={18}>
                    <Table columns={columns} dataSource={questions} loading={loading} />
                </Col>
                <Col span={6}>
                    <Card title="Category" bordered={false}>
                        <Select defaultValue="android" style={{ width: 120 }} onChange={(value) => console.log(`selected ${value}`)}>
                            <Select.Option value="android">Android</Select.Option>
                            <Select.Option value="java">Java</Select.Option>
                            <Select.Option value="behavioural">Behavioural</Select.Option>
                        </Select>
                    </Card>
                </Col>
            </Row>

        </Layout>
    )
}

const mapStateToProps = state => {
    const { questions, loading } = state.questionBank || {};

    return { questions, loading };
};

export default connect(mapStateToProps, { loadQuestions, addQuestion, updateQuestion, deleteQuestion })(QuestionBank);