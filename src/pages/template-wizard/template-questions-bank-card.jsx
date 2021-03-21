import React, { useState } from "react";
import styles from "./template-questions.module.css";
import { Divider, Select, Space, Table} from 'antd';
import Text from "antd/lib/typography/Text";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { Difficulty} from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import { flatten, sortedUniq } from "lodash/array";
import { filterQuestionCategory, filterQuestionDifficulty, filterQuestionTag } from "../../components/utils/filters";
import { localeCompare, localeCompareDifficult } from "../../components/utils/comparators";

const TemplateQuestionsBankCard = ({ questions, categories, groupQuestions, onAddQuestionClicked }) => {

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
            render: () => <PlusCircleTwoTone />
        }
    ];

    return (
        <div className={styles.cardContainerQuestionBank}>
                <div className={styles.cardHeaderSticky}>
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
                <div className={styles.table}>
                    <Table
                        rowKey="index"
                        pagination={false}
                        dataSource={selectedCategoryQuestions}
                        columns={columns}
                        rowClassName={styles.row}
                        onRow={record => ({
                            onClick: () => onRowClicked(record),
                        })}
                    />
                </div>
        </div>
    );
}

export default TemplateQuestionsBankCard;