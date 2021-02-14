import React, { useState } from "react";
import styles from "../../components/template/template-question-group.module.css";
import { Card, Divider, Space, Table, Tag } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";
import { defaultTo } from "lodash/util";
import { getDifficultyColor } from "../../components/utils/constants";

const TemplateQuestionsGroupCard = ({ groupName, groupQuestions, onRemoveQuestionClicked }) => {

    const table = React.useRef(null);
    const [scroll, setScroll] = useState(500)

    React.useEffect(() => {
        if(table.current) {
            setScroll(table.current.clientHeight)
        }
    }, [table])

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
        <Card className={styles.questionGroupCard}
              bodyStyle={{ paddingLeft: 0, paddingRight: 0, height: '95%'}}>
            <div className={styles.cardHeader}>
                <Space direction="vertical" size={4}>
                    <Text strong>{groupName}</Text>
                    <Text>{defaultTo(groupQuestions, []).length} questions</Text>
                </Space>
            </div>
            <Divider className={styles.divider} />
            <div ref={table} style={{ height: '95%'}}>
                <Table
                    pagination={false}
                    showHeader={false}
                    dataSource={groupQuestions}
                    columns={columns}
                    scroll={{ y: scroll }}
                    rowKey="index"
                />
            </div>
        </Card>
    );
}

export default TemplateQuestionsGroupCard