import React from 'react';
import { Card, Form, Input, Radio, Table, Tag } from "antd";
import AssessmentCheckbox from "../questions/assessment-checkbox"
import styles from "./interview-questions-card.module.css";
import { GroupAssessment } from "../../pages/common/constants";

const { Search } = Input;
const { TextArea } = Input;

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
                {(tags ? tags : []).map(tag => {
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
        title: 'Assessment',
        key: 'question',
        render: (question) => <AssessmentCheckbox
            assessment={question.assessment}
            disabled={question.disabled}
            onChange={value => {
                question.assessment = value
            }}
        />
    },
];

const InterviewQuestionsCard = (props) => {
    const group = props.group

    const onSearchClicked = text => {
        // TODO fix search
        // let lowerCaseText = text.toLocaleLowerCase()
        // setQuestions(data.filter(item =>
        //     item.question.toLocaleLowerCase().includes(lowerCaseText)
        //     || item.tags.includes(lowerCaseText)
        // ))
    };

    const onSearchTextChanged = e => {
        onSearchClicked(e.target.value)
    };

    const onAssessmentChanged = e => {
        group.assessment = e.target.value
    };

    const onNoteChanges = e => {
        group.notes = e.target.value
    };

    return (
        <Card
            id={group.name}
            title={group.name}
            bordered={false}
            extra={<Search placeholder="Search" className={styles.search} allowClear
                           onSearch={onSearchClicked} onChange={onSearchTextChanged} />}
            bodyStyle={{ padding: 12 }}
            className={styles.card}>

            <Table columns={columns} dataSource={group.questions} pagination={false} />

            <Form
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
                initialValues={{ remember: true }}
                className={styles.form}>
                <Form.Item label="Notes">
                    <TextArea
                        placeholder="Capture any key moments that happened during the interview."
                        disabled={props.disabled}
                        onChange={onNoteChanges}
                        defaultValue={group.notes} />
                </Form.Item>

                <Form.Item label="Assessment">
                    <Radio.Group key={group.assessment} defaultValue={group.assessment}
                                 disabled={props.disabled} onChange={onAssessmentChanged}>
                        <Radio.Button value={GroupAssessment.NO_PROFICIENCY}>no proficiency</Radio.Button>
                        <Radio.Button value={GroupAssessment.LOW_SKILLED}>low skills</Radio.Button>
                        <Radio.Button value={GroupAssessment.SKILLED}>skilled</Radio.Button>
                        <Radio.Button value={GroupAssessment.HIGHLY_SKILLED}>highly skilled</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default InterviewQuestionsCard