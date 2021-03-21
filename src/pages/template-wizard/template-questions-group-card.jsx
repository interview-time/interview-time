import React from "react";
import styles from "./template-questions.module.css";
import { Button, Divider, Space, Table } from 'antd';
import Text from "antd/lib/typography/Text";
import { defaultTo } from "lodash/util";
import { localeCompare, localeCompareDifficult } from "../../components/utils/comparators";
import { DeleteTwoTone } from "@ant-design/icons";

const TemplateQuestionsGroupCard = ({ groupName, groupQuestions, onRemoveQuestionClicked, onDoneClicked }) => {

    const columns = [
        {
            title: 'Question',
            key: 'question',
            dataIndex: 'question',
            fixed: 'left',
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
            key: 'action',
            width: 24,
            render: record => <DeleteTwoTone twoToneColor="red"
                                             className={styles.removeIcon}
                                             onClick={() => onRemoveQuestionClicked(record)} />
        }
    ];

    return (
        <div className={styles.cardContainerCompetenceArea}>
            <div className={styles.cardHeaderSticky}>
                <Space direction="vertical" size={4}>
                    <Text strong>{groupName}</Text>
                    <Text>{defaultTo(groupQuestions, []).length} questions</Text>
                </Space>
                <Button type="primary" onClick={onDoneClicked}>Done</Button>
            </div>
            <Divider className={styles.divider} />
            <div className={styles.table}>
                <Table
                    pagination={false}
                    dataSource={groupQuestions}
                    columns={columns}
                    rowKey="index"
                />
            </div>
        </div>
    );
}

export default TemplateQuestionsGroupCard