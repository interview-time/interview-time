import React from "react";
import styles from "./template-questions.module.css";
import { Card, Divider, Space, Table, Tag } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";
import { defaultTo } from "lodash/util";
import { getDifficultyColor } from "../../components/utils/constants";

const TemplateQuestionsGroupCard = ({ groupName, groupQuestions, onRemoveQuestionClicked }) => {

    const columns = [
        {
            title: 'Question',
            dataIndex: 'question',
            className: styles.questionVisible,
            render: (text, question) => <div className={styles.questionWrapper}>
                <div className={styles.questionBody}>
                    <Space direction="vertical">
                        <Text>{question.question}</Text>
                        <div>
                            <Tag key={question.difficulty} color={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                            </Tag>
                            {defaultTo(question.tags, []).map(tag => <Tag key={tag}>{tag.toLowerCase()}</Tag>)}
                        </div>
                    </Space>
                </div>
                <DeleteTwoTone twoToneColor="red" className={styles.removeIcon}
                               onClick={() => onRemoveQuestionClicked(question)} />
            </div>
        }
    ];
    return (
        <div className={styles.cardContainerCompetenceArea}>
            <Card bodyStyle={{ padding: 0 }}>
                <div className={styles.cardHeaderSticky}>
                    <Space direction="vertical" size={4}>
                        <Text strong>{groupName}</Text>
                        <Text>{defaultTo(groupQuestions, []).length} questions</Text>
                    </Space>
                </div>
                <Divider className={styles.divider} />
                <div className={styles.table}>
                    <Table
                        pagination={false}
                        showHeader={false}
                        dataSource={groupQuestions}
                        columns={columns}
                        rowKey="index"
                    />
                </div>
            </Card>
        </div>
    );
}

export default TemplateQuestionsGroupCard