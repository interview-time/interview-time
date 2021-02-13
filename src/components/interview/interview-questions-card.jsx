import styles from "./interview-questions-card.module.css";
import React from 'react';
import { Card, Form, Input, Radio, Table, Tag } from "antd";
import AssessmentCheckbox from "../questions/assessment-checkbox"
import { getDifficultyColor, GroupAssessment } from "../utils/constants";
import { localeCompare, localeCompareArray } from "../utils/comparators";
import { defaultTo } from "lodash/util";

const { TextArea } = Input;

const InterviewQuestionsCard = ({ group, disabled, onInterviewChange }) => {

    const columns = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => localeCompare(a.question, b.question),
        },
        {
            title: 'Difficulty',
            key: 'difficulty',
            dataIndex: 'difficulty',
            width: 125,
            sorter: (a, b) => localeCompare(a.difficulty, b.difficulty),
            render: difficulty => (
                <Tag key={difficulty} color={getDifficultyColor(difficulty)}>
                    {difficulty}
                </Tag>
            )
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: 250,
            sorter: (a, b) => localeCompareArray(a.tags, b.tags),
            render: tags => (
                <>
                    {defaultTo(tags, []).map(tag => {
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
            dataIndex: 'question',
            width: 140,
            render: (text, question) => <AssessmentCheckbox
                assessment={defaultTo(question.assessment, '')}
                disabled={disabled}
                onChange={value => {
                    question.assessment = value
                    onTriggerChangeEvent()
                }}
            />
        },
    ];

    const onAssessmentChanged = e => {
        group.assessment = e.target.value
        onTriggerChangeEvent()
    };

    const onNoteChanges = e => {
        group.notes = e.target.value
        onTriggerChangeEvent()
    };

    const onTriggerChangeEvent = () => {
        if (onInterviewChange !== undefined) {
            onInterviewChange()
        }
    }

    return (
        <Card
            id={group.name}
            title={group.name}
            bodyStyle={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
            className={styles.card}>

            <Table columns={columns} dataSource={group.questions} pagination={false} />

            <Form
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
                initialValues={{ remember: true }}
                className={styles.form}>
                <Form.Item label="Notes">
                    <TextArea
                        {...(disabled ? { readonly: "true" } : {})}
                        placeholder="Capture any key moments that happened during the interview."
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        onChange={onNoteChanges}
                        defaultValue={group.notes} />
                </Form.Item>

                <Form.Item label="Assessment">
                    <Radio.Group
                        key={group.assessment}
                        {...(disabled ? { value: group.assessment } : { defaultValue: group.assessment })}
                        buttonStyle="solid"
                        onChange={onAssessmentChanged}>
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