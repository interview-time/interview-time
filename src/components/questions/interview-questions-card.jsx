import React, {useState} from 'react';
import {Card, Form, Input, Table, Tag, Radio} from "antd";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox"
import styles from "./interviews-questions-card.module.css";

const {Search} = Input;
const {TextArea} = Input;

const ASSESSMENT_NO_PROFICIENCY = "no proficiency"
const ASSESSMENT_LOW_SKILLS = "low skills"
const ASSESSMENT_SKILLED = "skilled"
const ASSESSMENT_HIGHLY_SKILLED = "highly skilled"

const columns = [
    {
        title: 'Question',
        dataIndex: 'question',
        key: 'question',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.question.localeCompare(b.question)
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        width: 250,
        render: tags => (
            <>
                {tags.map(tag => {
                    return (
                        <Tag key={tag}>
                            {tag.toLowerCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Time',
        key: 'time',
        width: 100,
        dataIndex: 'time',
    },
    {
        title: 'Assessment',
        key: 'assessment',
        render: () => <AssessmentCheckbox />
    },
];

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

const InterviewQuestionsCard = () => {
    const [questions, setQuestions] = useState(data)

    function onSearchTextChanged(e) {
        onSearchClicked(e.target.value)
    }

    function onSearchClicked(text) {
        let lowerCaseText = text.toLocaleLowerCase()
        setQuestions(data.filter(item =>
            item.question.toLocaleLowerCase().includes(lowerCaseText)
            || item.tags.includes(lowerCaseText)
        ))
    }

    return (
        <Card
            title="Core Android"
            bordered={false}
            extra={<Search placeholder="Search" className={styles.search} allowClear
                           onSearch={onSearchClicked} onChange={onSearchTextChanged} />}
            bodyStyle={{padding: 12}}
            className={styles.card}>

            <Table columns={columns} dataSource={questions} pagination={false} />

            <Form
                labelCol={{span: 3}}
                wrapperCol={{span: 20}}
                name="basic"
                initialValues={{remember: true}}
                className={styles.form}>
                <Form.Item label="Notes">
                    <TextArea
                        placeholder="Capture any key moments that happened during the interview." />
                </Form.Item>

                <Form.Item label="Assessment">
                    <Radio.Group defaultValue="{a}">
                        <Radio.Button value="a">{ASSESSMENT_NO_PROFICIENCY}</Radio.Button>
                        <Radio.Button value="b">{ASSESSMENT_LOW_SKILLS}</Radio.Button>
                        <Radio.Button value="c">{ASSESSMENT_SKILLED}</Radio.Button>
                        <Radio.Button value="d">{ASSESSMENT_HIGHLY_SKILLED}</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default InterviewQuestionsCard