import React, { useState } from "react";
import styles from "./guide-question-group.module.css";
import { Card, Divider, Select, Space, Table, Tag } from 'antd';
import Text from "antd/lib/typography/Text";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { Difficulty, getDifficultyColor } from "../utils/constants";
import { defaultTo } from "lodash/util";
import { flatten, sortedUniq } from "lodash/array";
import { filterQuestionCategory, filterQuestionDifficulty, filterQuestionTag } from "../utils/filters";

const GuideQuestionBankCard = ({ questions, categories, groupQuestions, onAddQuestionClicked }) => {

    const [selectedCategory, setSelectedCategory] = useState()
    const [selectedCategoryQuestions, setSelectedCategoryQuestions] = useState([])
    const [selectedCategoryTags, setSelectedCategoryTags] = useState([])
    const [tagFilter, setTagFilter] = useState()
    const [difficultyFilter, setDifficultyFilter] = useState()

    React.useEffect(() => {
        // select first category when categories are loaded
        if (categories.length !== 0 && !selectedCategory) {
            setSelectedCategory(categories[0])
        }
        // eslint-disable-next-line
    }, [categories]);

    React.useEffect(() => {
        if (questions.length !== 0 && selectedCategory && groupQuestions) {
            const categoryQuestions = filterQuestionCategory(questions, selectedCategory)

            const categoryTags = sortedUniq(
                flatten(categoryQuestions.map(question => defaultTo(question.tags, []))).sort()
            )
            setSelectedCategoryTags(categoryTags.map(tag => ({ value: tag })))

            // show selected category questions without questions in the group
            let filteredQuestions = categoryQuestions
                .filter(question => !groupQuestions.find(element => element.questionId === question.questionId));
            if (tagFilter) {
                filteredQuestions = filterQuestionTag(filteredQuestions, tagFilter)
            }

            if (difficultyFilter) {
                filteredQuestions = filterQuestionDifficulty(filteredQuestions, difficultyFilter)
            }

            setSelectedCategoryQuestions(filteredQuestions)
        }
    }, [selectedCategory, questions, groupQuestions, tagFilter, difficultyFilter]);

    const onCategoryChange = category => {
        setSelectedCategory(category)
    };

    const onTagClear = () => {
        setTagFilter()
    }
    const onTagChange = tag => {
        setTagFilter(tag)
    };

    const onDifficultyClear = () => {
        setDifficultyFilter()
    }
    const onDifficultyChange = difficulty => {
        setDifficultyFilter(difficulty)
    };

    const onRowClicked = (question) => {
        onAddQuestionClicked(question)
    }

    const columns = [
        {
            title: 'Add',
            dataIndex: 'add',
            width: 30,
            render: () => <PlusCircleTwoTone className={styles.addIcon} />,
        },
        {
            title: 'Question',
            dataIndex: 'question',
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
            </div>
        }
    ];

    return (
        <Card bordered={false} className={styles.questionBankCard} bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className={styles.cardHeader}>
                <Space direction="vertical" size={4}>
                    <Text strong>Question Bank</Text> <Text>{selectedCategoryQuestions.length} questions</Text>
                </Space>
                <Space>
                    <Select
                        key={selectedCategory}
                        placeholder="Select category"
                        defaultValue={selectedCategory}
                        onSelect={onCategoryChange}
                        style={{ width: 180 }}
                        options={categories.map(category => ({ value: category }))}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.value.toLocaleLowerCase().includes(inputValue)
                        }
                    />
                    <Select
                        placeholder="Difficulty"
                        allowClear
                        onSelect={onDifficultyChange}
                        onClear={onDifficultyClear}
                        options={[
                            { value: Difficulty.EASY },
                            { value: Difficulty.MEDIUM },
                            { value: Difficulty.HARD },
                        ]}
                        style={{ width: 100 }}
                    />
                    <Select
                        key={selectedCategoryTags}
                        placeholder="Tag"
                        allowClear
                        onSelect={onTagChange}
                        onClear={onTagClear}
                        options={selectedCategoryTags}
                        style={{ width: 120 }}
                    />
                </Space>
            </div>
            <Divider className={styles.divider} />
            <Table
                rowKey="index"
                pagination={false}
                showHeader={false}
                dataSource={selectedCategoryQuestions}
                columns={columns}
                scroll={{ y: 700 }}
                rowClassName={styles.row}
                onRow={record => ({
                    onClick: () => onRowClicked(record),
                })}
            />
        </Card>
    );
}

export default GuideQuestionBankCard;