import styles from "./interview-details-card.module.css";
import React from 'react';
import { Card, Input, Radio, Space, Table, Tag } from "antd";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox"
import { GroupAssessment } from "../../components/utils/constants";
import { localeCompare, localeCompareArray, localeCompareDifficult } from "../../components/utils/comparators";
import { defaultTo } from "lodash/util";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const InterviewQuestionsCard = ({ group, disabled, onInterviewChange }) => {

    const [collapsed, setCollapsed] = React.useState(false)

    const columns = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            sortDirections: ['descend', 'ascend'],
            className: styles.multiLineText,
            sorter: (a, b) => localeCompare(a.question, b.question),
        },
        {
            title: 'Difficulty',
            key: 'difficulty',
            dataIndex: 'difficulty',
            width: 125,
            sorter: (a, b) => localeCompareDifficult(a.difficulty, b.difficulty),
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

    const onCollapseClicked = () => {
        setCollapsed(!collapsed)
    }

    return (
        <div id={group.name} className={styles.questionArea}>
            <Title level={4}>
                {collapsed && <CaretRightOutlined onClick={onCollapseClicked} style={{ paddingRight: 8 }} />}
                {!collapsed && <CaretDownOutlined onClick={onCollapseClicked} style={{ paddingRight: 8 }} />}
                {group.name} ({group.questions.length})
            </Title>
            {!collapsed && <div>
                <Card bodyStyle={{ padding: 0 }}>
                    <Table columns={columns} dataSource={group.questions} pagination={false} />
                </Card>

                <Space className={styles.space} direction="vertical">

                    <Text strong>Notes</Text>

                    <TextArea
                        {...(disabled ? { readonly: "true" } : {})}
                        placeholder="Capture any key moments that happened during the interview."
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        onChange={onNoteChanges}
                        defaultValue={group.notes} />
                </Space>

                <Space className={styles.space} direction="vertical">
                    <Text strong>Assessment</Text>

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
                </Space>
            </div>}
        </div>
    )
}

export default InterviewQuestionsCard