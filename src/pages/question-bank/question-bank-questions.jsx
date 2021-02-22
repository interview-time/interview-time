import styles from "./question-bank.module.css";
import QuestionDetailsModal from "./modal-question-details";
import { Button, Card, Dropdown, Input, Menu, message, Select, Space, Table, Tag } from "antd";
import { ArrowLeftOutlined, MoreOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { localeCompare, localeCompareArray, localeCompareDifficult } from "../../components/utils/comparators";
import { Difficulty} from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import {
    filterQuestionCategory,
    filterQuestionDifficulty,
    filterQuestionTag,
    filterQuestionText
} from "../../components/utils/filters";
import { flatten, sortedUniq } from "lodash/array";
import ImportQuestionsModal from "./modal-import-questions";

const { Search } = Input;

const TABLE_PADDING = 24

const MENU_KEY_IMPORT_CSV = 'csv'

const QuestionBankQuestions = ({
    selectedCategory,
    questions,
    addQuestion,
    addQuestions,
    updateQuestion,
    deleteQuestion,
    onBackToCategoriesClicked
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
                        return (<Tag key={tag}>{tag.toLowerCase()}</Tag>);
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

    const [questionDetailModal, setQuestionDetailModal] = useState({
        question: null,
        visible: false
    });

    const [importModalVisible, setImportModalVisible] = useState(false);

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

    const onMenuClicked = (info) => {
        if (info.key === MENU_KEY_IMPORT_CSV) {
            setImportModalVisible(true)
        }
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

    const onImportQuestionCancel = () => {
        setImportModalVisible(false)
    }

    const onImportQuestionsClicked = (questions) => {
        setImportModalVisible(false)
        addQuestions(
            questions.map(question => ({
                question: question[0],
                difficulty: Difficulty.EASY,
                category: selectedCategory.categoryName,
                tags: []
            }))
        )
        message.success(`${questions.length} questions imported.`)
    }

    return (
        <div className={styles.container}>
            <QuestionDetailsModal
                visible={questionDetailModal.visible}
                questionToUpdate={questionDetailModal.question}
                tags={selectedCategoryTags}
                onCreate={(question) => onUpdateQuestionClicked(question)}
                onCancel={onQuestionDetailCancel}
                onRemove={(question) => onRemoveQuestionClicked(question)}
            />
            <ImportQuestionsModal
                visible={importModalVisible}
                onImport={(questions) => onImportQuestionsClicked(questions)}
                onCancel={onImportQuestionCancel}
            />
            <Card className={styles.sticky}>
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
                        <Dropdown overlay={
                            <Menu onClick={(info) => onMenuClicked(info)}>
                                <Menu.Item key={MENU_KEY_IMPORT_CSV}>Import from CSV</Menu.Item>
                            </Menu>}>
                            <Button icon={<MoreOutlined />} />
                        </Dropdown>
                    </Space>
                </div>
            </Card>

            <div ref={questionsTable} className={styles.table}>
                <Card bodyStyle={{ padding: 0 }} style={{ marginTop: TABLE_PADDING }}>
                    <Table columns={columns}
                        pagination={false}
                        dataSource={selectedQuestions}
                        rowClassName={styles.row}
                        onRow={(record) => ({
                            onClick: () => onQuestionClicked(record),
                        })}
                    />
                </Card>
            </div>
        </div>
    )

}

export default QuestionBankQuestions