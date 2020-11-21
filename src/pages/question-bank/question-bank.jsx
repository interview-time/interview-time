import React from "react";
import Layout from "../../components/layout/layout";
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

const data = [
    {
        key: '1',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '2',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '3',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '4',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '5',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '6',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '7',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '8',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '9',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '10',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '11',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '12',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '13',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '14',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '15',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '16',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
    {
        key: '17',
        question: 'What are configuration changes and when do they happen?',
        tags: ['android', 'activity', 'lifecycle'],
        category: 'android',
        time: 2,
    },
];

const tags = ['activity (23)', 'lifecycle (8)', 'ui (6)', 'view (11)', 'concurrency (13)', 'layout (7)', 'performance (4)', 'androidx (7)', 'gradle (4)'];

const QuestionBank = () => {
    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Question Bank"
        />}>
            <Row gutter={16}>
                <Col span={18}>
                    <Table columns={columns} dataSource={data} />
                </Col>
                <Col span={6}>
                    <Card title="Category" bordered={false}>
                        <Select defaultValue="android" style={{ width: 120 }} onChange={(value) => console.log(`selected ${value}`)}>
                            <Select.Option value="android">Android</Select.Option>
                            <Select.Option value="java">Java</Select.Option>
                            <Select.Option value="behavioural">Behavioural</Select.Option>
                        </Select>
                    </Card>

                    <Card title="Tags" bordered={false} className={styles.tagsCard}>
                        {tags.map((tag) => <Tag color="green" key={tag} className={styles.tag}>
                            {tag}
                        </Tag>)}

                    </Card>
                </Col>
            </Row>

        </Layout>
    )
}

export default QuestionBank;