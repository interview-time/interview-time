import React, { useState } from 'react';
import styles from "./guide-question-group.module.css";
import { DragOutlined, DeleteTwoTone } from '@ant-design/icons';
import { List, Card, Space, Input, Row, Col, Select, Tag } from "antd";
import Typography from "antd/es/typography";

const categories = [
    { value: 'Android' },
    { value: 'Java' },
    { value: 'Behavioural' },
];

const { Search } = Input;
const { Text } = Typography;

const data = [
    {
        key: '1',
        question: 'What are configuration changes and when do they happen?',
        tags: ["android", "activity", "lifecycle"],
        time: '2 min',
    },
    {
        key: '2',
        question: 'What is a broadcast receiver?',
        tags: ["android", "activity", "lifecycle"],
        time: '2 min',
    },
    {
        key: '3',
        question: 'Is it possible to create an activity in Android without a user interface ?',
        tags: ["android", "activity", "lifecycle"],
        time: '2 min',
    },
    {
        key: '4',
        question: 'Which method is called only once in a fragment life cycle?',
        tags: ["android", "activity", "lifecycle"],
        time: '2 min',
    },
    {
        key: '5',
        question: 'What is ANR, and why does it happen?',
        tags: ["android", "activity", "lifecycle"],
        time: '2 min',
    },
    {
        key: '6',
        question: 'How do you supply construction arguments into a Fragment?',
        tags: ["android", "activity", "lifecycle"],
        time: '2 min',
    },
    {
        key: '7',
        question: 'What is the difference between Service and IntentService? How is each used?',
        tags: ["android", "activity", "lifecycle"],
        time: '2 min',
    },
    {
        key: '8',
        question: 'What are “launch modes”? What are the two mechanisms by which they can be defined? What specific types of launch modes are supported?',
        tags: ["android", "activity", "lifecycle"],
        time: '2 min',
    },
];

const GuideQuestionGroup = (props) => {

    const [questions, setQuestions] = useState(data)

    const onSearchTextChanged = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = (text) => {
        let lowerCaseText = text.toLocaleLowerCase()
        setQuestions(data.filter(item =>
            item.question.toLocaleLowerCase().includes(lowerCaseText)
            || item.tags.includes(lowerCaseText)
        ))
    }

    return <Row>
        <Col span={12}>
            <Card className={styles.questionGroupCard} title="Question Group" bordered={false}>
                <List
                    dataSource={questions}
                    renderItem={item => <List.Item>
                        <div className={styles.questionBody}>
                            <Space><DragOutlined className={styles.dragIcon} /></Space>
                            <Space direction="vertical">
                                <Text>{item.question}</Text>
                                <div>
                                    {item.tags.map(tag => <Tag key={tag}>{tag.toLowerCase()}</Tag>)}
                                </div>
                            </Space>
                        </div>

                        <Space direction="vertical" align="end" className={styles.metaBody}>
                            <Text>{item.time}</Text>
                            <DeleteTwoTone twoToneColor="red" />
                        </Space>
                    </List.Item>}
                />
            </Card>
        </Col>
        <Col span={12}>
            <Card className={styles.questionBankCard} title="Question Bank" bordered={false}>
                <div className={styles.questionBankBody}>
                    <Select
                        className={styles.categorySelect}
                        options={categories}
                        placeholder="Category"
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.value.toLocaleLowerCase().includes(inputValue)
                        }
                    />
                    <Search placeholder="Search" allowClear enterButton onSearch={onSearchClicked}
                        onChange={onSearchTextChanged} />
                </div>

                <List
                    dataSource={questions}
                    renderItem={item => <List.Item>
                        <div className={styles.questionBody}>
                            <Space><DragOutlined className={styles.dragIcon} /></Space>
                            <Space direction="vertical">
                                <Text>{item.question}</Text>
                                <div>
                                    {item.tags.map(tag => <Tag key={tag}>{tag.toLowerCase()}</Tag>)}
                                </div>
                            </Space>
                        </div>

                        <Space direction="vertical" align="end" className={styles.metaBody}>
                            <Text>{item.time}</Text>
                        </Space>
                    </List.Item>}
                />
            </Card>
        </Col>
    </Row>
}

export default GuideQuestionGroup