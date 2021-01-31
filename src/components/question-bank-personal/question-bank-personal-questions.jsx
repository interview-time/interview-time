import styles from "./question-bank.module.css";
import QuestionDetailsModal from "../question-bank/modal-question-details";
import { Button, Card, Dropdown, Input, Menu, Select, Space, Table, Tag } from "antd";
import { ArrowLeftOutlined, MoreOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { localeCompare, localeCompareArray } from "../utils/comparators";
import { Difficulty, getDifficultyColor } from "../utils/constants";
import { defaultTo } from "lodash/util";
import {
    filterQuestionCategory,
    filterQuestionDifficulty,
    filterQuestionTag,
    filterQuestionText
} from "../utils/filters";
import { flatten, sortedUniq } from "lodash/array";

const { Search } = Input;

const KEY_DELETE = "delete"
const KEY_EDIT = "edit"

const TABLE_PADDING = 24
const TABLE_HEADER = 56

const QuestionBankPersonalQuestions = ({
                                           selectedCategory,
                                           questions,
                                           addQuestion,
                                           updateQuestion,
                                           deleteQuestion,
                                           onBackToCategoriesClicked,
                                           onDeleteCategoryClicked,
                                           onEditCategoryClicked
                                       }) => {

    const columns = [
        {
            title: 'Question',
            key: 'question',
            dataIndex: 'question',
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
                        return (<Tag className={styles.tag} key={tag}>{tag.toLowerCase()}</Tag>);
                    })}
                </>
            ),
        },
    ]

    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedCategoryTags, setSelectedCategoryTags] = useState([])

    const [textFilter, setTextFilter] = useState()
    const [difficultyFilter, setDifficultyFilter] = useState()
    const [tagFilter, setTagFilter] = useState()

    const questionsTable = React.useRef(null);
    const [scroll, setScroll] = useState(500)

    const [questionDetailModal, setQuestionDetailModal] = useState({
        question: null,
        visible: false
    });

    React.useEffect(() => {
        if(questionsTable.current) {
            setScroll(questionsTable.current.clientHeight - TABLE_PADDING - TABLE_HEADER)
        }
    }, [questionsTable])

    React.useEffect(() => {
        let categoryQuestions = filterQuestionCategory(questions, selectedCategory.categoryName)

        const categoryTags = sortedUniq(
            flatten(categoryQuestions.map(question => defaultTo(question.tags, []))).sort()
        )
        setSelectedCategoryTags(categoryTags.map(tag => ({ value: tag })))

        let filteredQuestions = categoryQuestions
        if (textFilter && textFilter.length !== '') {
            filteredQuestions = filterQuestionText(filteredQuestions, textFilter)
        }

        if (difficultyFilter) {
            filteredQuestions = filterQuestionDifficulty(filteredQuestions, difficultyFilter)
        }

        if (tagFilter) {
            filteredQuestions = filterQuestionTag(filteredQuestions, tagFilter)
        }

        setSelectedQuestions(filteredQuestions)
    }, [selectedCategory, questions, textFilter, difficultyFilter, tagFilter]);

    const onAddQuestionClicked = () => {
        setQuestionDetailModal({
            question: null,
            visible: true
        })
    }

    const onUpdateQuestionClicked = (question) => {
        if (question.questionId) {
            updateQuestion(question)
        } else {
            addQuestion({
                ...question,
                category: selectedCategory.categoryName,
            })
        }
        setQuestionDetailModal({
            ...questionDetailModal,
            visible: false
        })
    };

    const onRemoveQuestionClicked = (question) => {
        deleteQuestion(question.questionId)
        setQuestionDetailModal({
            ...questionDetailModal,
            visible: false
        })
    };

    const onQuestionDetailCancel = () => {
        setQuestionDetailModal({
            ...questionDetailModal,
            visible: false
        })
    };

    const onQuestionClicked = (question) => {
        setQuestionDetailModal({
            question: question,
            visible: true
        })
    }

    const onMenuClicked = (e) => {
        if (e.key === KEY_DELETE) {
            onDeleteCategoryClicked()
        } else if (e.key === KEY_EDIT) {
            onEditCategoryClicked()
        }
    };

    const categoryMenu = (
        <Menu onClick={onMenuClicked}>
            <Menu.Item key={KEY_EDIT}>Edit Category</Menu.Item>
            <Menu.Item key={KEY_DELETE}>Delete Category</Menu.Item>
        </Menu>
    );

    const onQuestionSearchChanges = e => {
        onQuestionSearchClicked(e.target.value)
    };

    const onQuestionSearchClicked = text => {
        setTextFilter(text)
    };

    const onDifficultyClear = () => {
        setDifficultyFilter()
    }
    const onDifficultyChange = difficulty => {
        setDifficultyFilter(difficulty)
    };

    const onTagClear = () => {
        setTagFilter()
    }
    const onTagChange = tag => {
        setTagFilter(tag)
    };

    return (
        <div className={styles.container}>
            <QuestionDetailsModal
                visible={questionDetailModal.visible}
                questionToUpdate={questionDetailModal.question}
                onCreate={(question) => onUpdateQuestionClicked(question)}
                onCancel={onQuestionDetailCancel}
                onRemove={(question) => onRemoveQuestionClicked(question)}
            />
            <Card>
                <div className={styles.tabHeader}>
                    <Button type="link" icon={<ArrowLeftOutlined />}
                            onClick={onBackToCategoriesClicked}>{selectedCategory.categoryName}</Button>
                    <Space>
                        <Search placeholder="Search" allowClear
                                className={styles.tabHeaderSearch}
                                onSearch={onQuestionSearchClicked}
                                onChange={onQuestionSearchChanges}
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
                            style={{ width: 125 }}
                        />
                        <Select
                            key={selectedCategoryTags}
                            placeholder="Tag"
                            allowClear
                            onSelect={onTagChange}
                            onClear={onTagClear}
                            options={selectedCategoryTags}
                            style={{ width: 125 }}
                        />
                    </Space>
                    <Space>
                        <Button type="primary" onClick={() => onAddQuestionClicked()}>Add question</Button>

                        <Dropdown overlay={categoryMenu}>
                            <Button icon={<MoreOutlined />} />
                        </Dropdown>
                    </Space>
                </div>
            </Card>

            <div ref={questionsTable} className={styles.table}>
                <Table columns={columns}
                       pagination={false}
                       style={{ marginTop: TABLE_PADDING }}
                       scroll={{ y: scroll }}
                       dataSource={selectedQuestions}
                       rowClassName={styles.row}
                       onRow={(record) => ({
                           onClick: () => onQuestionClicked(record),
                       })}
                />
            </div>
        </div>
    )

}

export default QuestionBankPersonalQuestions