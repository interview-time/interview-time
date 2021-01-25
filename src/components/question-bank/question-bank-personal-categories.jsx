import React, { useState } from 'react';
import { connect } from "react-redux";
import styles from "./question-bank-personal-categories.module.css";
import { Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Row, Space, Statistic, Table, Tag } from "antd";
import { getAvatarColor, getAvatarText } from "../../pages/common/constants";
import {
    addCategory,
    addQuestion,
    deleteCategory,
    deleteQuestion,
    updateCategory,
    updateQuestion
} from "../../store/question-bank/actions";
import Text from "antd/lib/typography/Text";
import { ArrowLeftOutlined, MoreOutlined } from "@ant-design/icons";
import CategoryDetailsModal from "./modal-category-details";
import QuestionDetailsModal from "./modal-question-details";
import { Link } from "react-router-dom";

const { Meta } = Card;
const { Search } = Input;

const STATE_CATEGORIES = "categories"
const STATE_CATEGORY_DETAILS = "category-details"

const KEY_DELETE = "delete"
const KEY_EDIT = "edit"

const QuestionBankPersonalCategories = ({
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
    const [categoriesData, setCategoriesData] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState({});

    const [categoryDetailsModal, setCategoryDetailsModal] = useState({
        category: '',
        visible: false
    });
    const [questionDetailModal, setQuestionDetailModal] = useState({
        question: {},
        visible: false
    });

    const columns = [
        {
            title: 'Question',
            key: 'question',
            dataIndex: 'question',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.position.localeCompare(b.position),
            render: (question, record) => (
                <Link onClick={() => onQuestionClicked(record)}>{question}</Link>
            ),
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: 250,
            render: tags => (
                <>
                    {(tags ? tags : []).map(tag => {
                        return (
                            <Tag key={tag}>
                                {tag.toLowerCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
    ]

    React.useEffect(() => {
        let categoriesData = []
        categories.forEach(category => {
            categoriesData.push({
                categoryName: category,
                questions: questions.filter(question => question.category === category)
            })
        })
        setCategoriesData(categoriesData)
    }, [categories, questions]);

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

    const getTagsCount = category => {
        let tags = 0
        category.questions.forEach(item => {
            if (item.tags) {
                tags += item.tags.length
            }
        })
        return tags
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
            {isCategoriesState() && <div>
                <Card>
                    <div className={styles.tabHeader}>
                        <Text>Select category</Text>
                        <div className={styles.space} />
                        <Space>
                            <Search placeholder="Search" allowClear enterButton className={styles.tabHeaderSearch}
                                // onSearch={onSearchClicked}
                                // onChange={onSearchTextChanged}
                            />
                            <Button type="primary" onClick={onAddCategoryClicked}>Add category</Button>
                        </Space>
                    </div>
                </Card>
                <List
                    className={styles.categories}
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 4,
                    }}
                    dataSource={categoriesData}
                    loading={loading}
                    renderItem={category => <List.Item>
                        <Card hoverable onClick={() => onCategoryClicked(category)}>
                            <Meta title={category.categoryName} avatar={
                                <Avatar size="large" style={{
                                    backgroundColor: getAvatarColor(category.categoryName),
                                    verticalAlign: 'middle',
                                }}>{getAvatarText(category.categoryName)}</Avatar>}
                            />
                            <Row span={24}>
                                <Col span={12}>
                                    <Statistic title="Questions"
                                               value={category.questions.length}
                                               valueStyle={{ fontSize: "large" }} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Tags"
                                               value={getTagsCount(category)}
                                               valueStyle={{ fontSize: "large" }} />
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>}
                />
            </div>}
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
                            <Search placeholder="Search" allowClear enterButton className={styles.tabHeaderSearch}
                                // onSearch={onSearchClicked}
                                // onChange={onSearchTextChanged}
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
                       dataSource={questions.filter(question => question.category === selectedCategory.categoryName)} />
            </div>}
        </>
    );
}
const mapStateToProps = state => {
    const { categories, questions, loading } = state.questionBank || {};

    return {
        categories,
        questions,
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
})(QuestionBankPersonalCategories);