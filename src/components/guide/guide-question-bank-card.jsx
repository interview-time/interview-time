import React, { useState } from "react";
import styles from "./guide-question-bank-card.module.css";
import { Card, Divider, Select, Space, Table, Tag } from 'antd';
import Text from "antd/lib/typography/Text";
import { PlusCircleTwoTone } from "@ant-design/icons";

const GuideQuestionBankCard = ({ questions, categories, groupQuestions, onAddQuestionClicked }) => {

    const [selectedCategory, setSelectedCategory] = useState()
    const [selectedCategoryQuestions, setSelectedCategoryQuestions] = useState([])

    React.useEffect(() => {
        // select first category when categories are loaded
        if (categories.length !== 0 && !selectedCategory) {
            setSelectedCategory(categories[0])
        }
    }, [categories]);

    React.useEffect(() => {
        // show selected category questions without questions in the group
        if (questions.length !== 0 && selectedCategory && groupQuestions) {
            setSelectedCategoryQuestions((questions ? questions : [])
                .filter((question) => question.category === selectedCategory
                    && !groupQuestions.find(element => element.questionId === question.questionId))
            )
        }
    }, [selectedCategory, questions, groupQuestions]);

    const onCategoryChange = category => {
        setSelectedCategory(category)
    };

    const getTags = (question) => question.tags ? question.tags : []

    const columns = [
        {
            title: 'Add',
            dataIndex: 'add',
            width: 30,
            render: (text, question) =>
                <PlusCircleTwoTone className={styles.addIcon} onClick={() => onAddQuestionClicked(question)} />,
        },
        {
            title: 'Question',
            dataIndex: 'question',
            render: (text, question) => <div className={styles.questionWrapper}>
                <div className={styles.questionBody}>
                    <Space direction="vertical">
                        <Text>{question.question}</Text>
                        <div>
                            {getTags(question).map(tag => <Tag key={tag}>{tag.toLowerCase()}</Tag>)}
                        </div>
                    </Space>
                </div>
            </div>
        }
    ];

    return (
        <Card bordered={false} bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className={styles.questionHeader}>
                <Space>
                    <Text strong>Question Bank</Text> <Text>{selectedCategoryQuestions.length} questions</Text>
                </Space>
                <div className={styles.space} />
                <Select
                    key={selectedCategory}
                    placeholder="Select category"
                    defaultValue={selectedCategory}
                    onSelect={onCategoryChange}
                    style={{ width: 200 }}
                    options={categories.map(category => ({ value: category }))}
                    showSearch
                    filterOption={(inputValue, option) =>
                        option.value.toLocaleLowerCase().includes(inputValue)
                    }
                />
            </div>
            <Divider style={{ marginBottom: 0 }} />
            <Table
                pagination={false}
                showHeader={false}
                dataSource={selectedCategoryQuestions}
                columns={columns}
                scroll={{ y: 700 }}
                rowKey="index" />
        </Card>
    );
}

export default GuideQuestionBankCard;