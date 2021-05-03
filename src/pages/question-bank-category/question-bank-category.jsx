import styles from "./question-bank-category.module.css";
import QuestionDetailsModal from "./modal-question-details";
import { Button, Dropdown, Input, Menu, message, Select, Space, Table, Tag } from "antd";
import { ArrowLeftOutlined, MoreOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { localeCompare, localeCompareArray, localeCompareDifficult } from "../../components/utils/comparators";
import { Difficulty } from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import {
    filterQuestionDifficulty,
    filterQuestionTag,
    filterQuestionText
} from "../../components/utils/filters";
import { flatten, sortedUniq } from "lodash/array";
import ImportQuestionsModal from "./modal-import-questions";
import Layout from "../../components/layout/layout";
import { useHistory, useParams, withRouter } from "react-router-dom";
import {
    addQuestion,
    addQuestions,
    deleteQuestion,
    loadQuestionBank,
    updateQuestion
} from "../../store/question-bank/actions";
import { connect } from "react-redux";
import { routeQuestionBank } from "../../components/utils/route";

const { Search } = Input;

const MENU_KEY_IMPORT_CSV = 'csv'

/**
 *
 * @param {CategoryHolder[]} categories
 * @param categoriesLoading
 * @param loadQuestionBank
 * @param updateQuestion
 * @param addQuestion
 * @param addQuestions
 * @param deleteQuestion
 * @returns {JSX.Element}
 * @constructor
 */
const QuestionBankCategory = ({
                                  categories,
                                  categoriesLoading,
                                  loadQuestionBank,
                                  updateQuestion,
                                  addQuestion,
                                  addQuestions,
                                  deleteQuestion,
                              }) => {
    const columns = [
        {
            title: 'Question',
            key: 'question',
            dataIndex: 'question',
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
                        return (<Tag key={tag}>{tag.toLowerCase()}</Tag>);
                    })}
                </>
            ),
        },
    ]

    /**
     * @type {CategoryHolder}
     */
    const emptyCategory= {
        category: {},
        questions: []
    }

    /**
     *
     * @type {Question[]}
     */
    const emptyQuestions = []

    const [category, setCategory] = useState(emptyCategory);
    const [filteredQuestions, setFilteredQuestions] = useState(emptyQuestions);
    const [selectedCategoryTags, setSelectedCategoryTags] = useState([])

    const [textFilter, setTextFilter] = useState()
    const [difficultyFilter, setDifficultyFilter] = useState()
    const [tagFilter, setTagFilter] = useState()

    const [questionDetailModal, setQuestionDetailModal] = useState({
        question: null,
        visible: false
    });

    const [importModalVisible, setImportModalVisible] = useState(false);

    const { id } = useParams();

    const history = useHistory();

    React.useEffect(() => {
        if ((!categories || categories.length === 0) && !categoriesLoading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        let category = categories.find(c => c.category.categoryId === id)
        if (category) {
            const categoryTags = sortedUniq(
                flatten(category.questions.map(question => defaultTo(question.tags, []))).sort()
            )
            setSelectedCategoryTags(categoryTags.map(tag => ({ value: tag })))

            let filteredQuestions = category.questions
            if (textFilter && textFilter.length !== '') {
                filteredQuestions = filterQuestionText(filteredQuestions, textFilter)
            }

            if (difficultyFilter) {
                filteredQuestions = filterQuestionDifficulty(filteredQuestions, difficultyFilter)
            }

            if (tagFilter) {
                filteredQuestions = filterQuestionTag(filteredQuestions, tagFilter)
            }

            setCategory(category)
            setFilteredQuestions(filteredQuestions)
        }
    }, [id, categories, textFilter, difficultyFilter, tagFilter]);

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
                category: category.category.categoryName,
                categoryId: category.category.categoryId,
            })
        }
        setQuestionDetailModal({
            ...questionDetailModal,
            visible: false
        })
    };

    const onRemoveQuestionClicked = (question) => {
        deleteQuestion(question.questionId, question.categoryId)
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
                categoryId: category.category.categoryId,
                category: category.category.categoryName,
                tags: []
            }))
        )
        message.success(`${questions.length} questions imported.`)
    }

    const onBackToCategoriesClicked = () => {
        history.push(routeQuestionBank())
    }

    return (
        <Layout pageHeader={
            <div className={styles.header}>
                <div align="center" onClick={onBackToCategoriesClicked}  className={styles.headerTitleContainer}>
                    <ArrowLeftOutlined />
                    <span className={styles.headerTitle} style={{marginLeft: 8, marginRight: 8}}>
                        {category.category.categoryName}
                    </span>
                </div>
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
                <Space style={{marginRight: 24}}>
                    <Button type="primary" onClick={() => onAddQuestionClicked()}>Add question</Button>
                    <Dropdown overlay={
                        <Menu onClick={(info) => onMenuClicked(info)}>
                            <Menu.Item key={MENU_KEY_IMPORT_CSV}>Import from CSV</Menu.Item>
                        </Menu>}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            </div>
        }>
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

                <div className={styles.tableContainer}>
                    <Table
                        className={styles.table}
                        columns={columns}
                        pagination={false}
                        loading={categoriesLoading}
                        dataSource={filteredQuestions}
                        rowClassName={styles.row}
                        onRow={(record) => ({
                            onClick: () => onQuestionClicked(record),
                        })}
                    />
                </div>
            </div>
        </Layout>
    )
}

const mapStateToProps = state => {
    const { categories, loading } = state.questionBank || {};

    return {
        categories: categories,
        categoriesLoading: loading
    };
};

const mapDispatch = {
    loadQuestionBank,
    addQuestion,
    addQuestions,
    updateQuestion,
    deleteQuestion,
}

export default withRouter(connect(mapStateToProps, mapDispatch)(QuestionBankCategory))