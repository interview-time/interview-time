import React, { useState } from 'react';
import { connect } from "react-redux";
import styles from "./question-bank.module.css";
import { Button, Card, Dropdown, Input, Menu, Space, Table, Tag } from "antd";
import { getDifficultyColor } from "../utils/constants";
import {
    addCategory,
    addQuestion,
    deleteCategory,
    deleteQuestion,
    updateCategory,
    updateQuestion
} from "../../store/question-bank/actions";
import { ArrowLeftOutlined, MoreOutlined } from "@ant-design/icons";
import CategoryDetailsModal from "../question-bank/modal-category-details";
import QuestionDetailsModal from "../question-bank/modal-question-details";
import { Link } from "react-router-dom";
import collection from "lodash/collection";
import { arrayComparator, stringComparator } from "../utils/comparators";
import QuestionBankPersonalCategories from "./question-bank-personal-categories";
const { Search } = Input;

const STATE_CATEGORIES = "categories"
const STATE_CATEGORY_DETAILS = "category-details"

const KEY_DELETE = "delete"
const KEY_EDIT = "edit"

const QuestionBankPersonal = ({
                                            categories,
                                            questions,
                                            loading,
                                            addQuestion,
                                            updateQuestion,
                                            deleteQuestion,
                                            addCategory,
                                            deleteCategory,
                                            updateCategory,
                                        }) => {

    const [state, setState] = useState(STATE_CATEGORIES);

    const [selectedCategory, setSelectedCategory] = useState({});
    const [selectedQuestions, setSelectedQuestions] = useState({});

    const [categoryDetailsModal, setCategoryDetailsModal] = useState({
        category: '',
        visible: false
    });
    const [questionDetailModal, setQuestionDetailModal] = useState({
        question: {},
        visible: false
    });

    const questionSearchRef = React.useRef(null);

    const columns = [
        {
            title: 'Question',
            key: 'question',
            dataIndex: 'question',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => stringComparator(a.question, b.question),
            render: (question, record) => (
                <Link className={styles.questionLink} onClick={() => onQuestionClicked(record)}>{question}</Link>
            ),
        },
        {
            title: 'Difficulty',
            key: 'difficulty',
            dataIndex: 'difficulty',
            width: 125,
            sorter: (a, b) => stringComparator(a.difficulty, b.difficulty),
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
            sorter: (a, b) => arrayComparator(a.tags, b.tags),
            render: tags => (
                <>
                    {(tags ? tags : []).map(tag => {
                        return (
                            <Tag className={styles.tag} key={tag} onClick={() => {
                                onTagClicked(tag)
                            }}>
                                {tag.toLowerCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
    ]

    React.useEffect(() => {
        setSelectedQuestions(questions.filter(question => question.category === selectedCategory.categoryName))
    }, [selectedCategory, questions]);

    const isCategoriesState = () => state === STATE_CATEGORIES

    const isCategoryDetailsState = () => state === STATE_CATEGORY_DETAILS

    const onCategoryClicked = (category) => {
        setSelectedCategory(category)
        setState(STATE_CATEGORY_DETAILS)
    };

    const onBackToCategoriesClicked = () => {
        setState(STATE_CATEGORIES)
    };

    const onAddCategoryClicked = () => {
        setCategoryDetailsModal({
            visible: true,
            category: ''
        })
    }

    const onUpdateCategoryClicked = (oldCategory, newCategory) => {
        setCategoryDetailsModal({
            visible: false,
            category: ''
        });
        updateCategory(oldCategory, newCategory)
        setState(STATE_CATEGORIES)
    };

    const onCreateCategoryClicked = (category) => {
        setCategoryDetailsModal({
            visible: false,
            category: ''
        });
        addCategory(category)
        setState(STATE_CATEGORIES)
    };

    const onCategoryDetailCancel = () => {
        setCategoryDetailsModal({
            visible: false,
            category: ''
        });
    }

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
            question: null,
            visible: false
        })
    };

    const onRemoveQuestionClicked = (question) => {
        deleteQuestion(question.questionId)
        setQuestionDetailModal({
            question: null,
            visible: false
        })
    };

    const onQuestionDetailCancel = () => {
        setQuestionDetailModal({
            question: null,
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
        if(e.key === KEY_DELETE) {
            deleteCategory(selectedCategory.categoryName)
            setState(STATE_CATEGORIES)
        }  else if(e.key === KEY_EDIT) {
            setCategoryDetailsModal({
                visible: true,
                category: selectedCategory.categoryName
            });
        }
    };

    const categoryMenu = (
        <Menu onClick={onMenuClicked}>
            <Menu.Item key={KEY_EDIT}>Edit Category</Menu.Item>
            <Menu.Item key={KEY_DELETE}>Delete Category</Menu.Item>
        </Menu>
    );

    const onTagClicked = tag => {
        let text = `[${tag}]`
        questionSearchRef.current.setValue(text)
        onQuestionSearchClicked(text)
    }

    const onQuestionSearchChanges = e => {
        onQuestionSearchClicked(e.target.value)
    };

    const onQuestionSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase();
        if(lowerCaseText.includes('[') || lowerCaseText.includes(']')) { // tag search
            lowerCaseText = lowerCaseText.replace('[', '')
            lowerCaseText = lowerCaseText.replace(']', '')
            setSelectedQuestions(
                questions.filter(question => question.category === selectedCategory.categoryName
                    && question.tags.find(tag => tag.toLocaleLowerCase().includes(lowerCaseText)))
            )
        } else {
            setSelectedQuestions(
                questions.filter(question => question.category === selectedCategory.categoryName
                    && question.question.toLocaleLowerCase().includes(lowerCaseText))
            )
        }
    };

    return (
        <>
            <CategoryDetailsModal
                visible={categoryDetailsModal.visible}
                categoryToUpdate={categoryDetailsModal.category}
                onUpdate={onUpdateCategoryClicked}
                onCreate={onCreateCategoryClicked}
                onCancel={onCategoryDetailCancel}
            />
            {isCategoriesState() && <QuestionBankPersonalCategories
                categories={categories}
                questions={questions}
                loading={loading}
                onCategoryClicked={onCategoryClicked}
                onAddCategoryClicked={onAddCategoryClicked}
            />}
            {isCategoryDetailsState() && <div>
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
                        <div className={styles.space} />
                        <Space>
                            <Search placeholder="Search" allowClear ref={questionSearchRef}
                                    enterButton className={styles.tabHeaderSearch}
                                    onSearch={onQuestionSearchClicked}
                                    onChange={onQuestionSearchChanges}
                            />
                            <Button type="primary" onClick={() => onAddQuestionClicked()}>Add question</Button>

                            <Dropdown overlay={categoryMenu}>
                                <Button icon={<MoreOutlined />} />
                            </Dropdown>
                        </Space>
                    </div>
                </Card>

                <Table columns={columns}
                       pagination={false} style={{ marginTop: 24 }}
                       dataSource={selectedQuestions} />
            </div>}
        </>
    );
}
const mapStateToProps = state => {
    const { categories, questions, loading } = state.questionBank || {};

    return {
        categories: categories.sort(),
        questions: collection.sortBy(questions, ['question']),
        loading
    };
};

export default connect(mapStateToProps, {
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addCategory,
    deleteCategory,
    updateCategory
})(QuestionBankPersonal);