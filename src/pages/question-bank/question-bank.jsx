import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { addCategory, deleteCategory, loadQuestionBank, updateCategory } from "../../store/question-bank/actions";
import { Alert, Button, Card, Dropdown, Input, List, Menu, message, Space } from 'antd';
import styles from "./question-bank.module.css";
import { Link, useHistory } from "react-router-dom";
import { routeLibrary, routeQuestionBankCategory } from "../../components/utils/route";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { ArrowRightIcon, CustomIcon } from "../../components/utils/icons";
import confirm from "antd/lib/modal/confirm";
import { questionsToTags } from "../../components/utils/converters";
import { cloneDeep } from "lodash/lang";
import CategoryDetailsModal from "./modal-category-details";

const { Search } = Input;

const NEW_CATEGORY = "NEW_CATEGORY"
const grid = {
    gutter: 16,
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 5,
};

/**
 *
 * @param {CategoryHolder[]} categories
 * @param categoriesLoading
 * @param loadQuestionBank
 * @param addCategory
 * @param deleteCategory
 * @param updateCategory
 * @returns {JSX.Element}
 * @constructor
 */
const QuestionBank = ({
                          categories,
                          categoriesLoading,
                          loadQuestionBank,
                          addCategory,
                          deleteCategory,
                          updateCategory,
                      }) => {

    /**
     *
     * @type {CategoryHolder[]}
     */
    const emptyCategories = []

    const history = useHistory();
    const [filteredCategories, setFilteredCategories] = useState(emptyCategories);

    const [categoryDetailsModal, setCategoryDetailsModal] = useState({
        category: null,
        visible: false
    });

    React.useEffect(() => {
        // first element is a new category card
        if ((!categories || categories.length <= 1) && !categoriesLoading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setFilteredCategories(categories)
    }, [categories]);

    /**
     *
     * @param {Category} category
     */
    const onCategoryClicked = (category) => {
        history.push(routeQuestionBankCategory(category.categoryId))
    };

    const onAddCategoryClicked = () => {
        setCategoryDetailsModal({
            visible: true
        })
    }

    /**
     *
     * @param {Category} category
     */
    const onUpdateCategoryClicked = (category) => {
        setCategoryDetailsModal({
            visible: false,
            category: category
        });
        updateCategory(category)
        message.success(`Category renamed to '${category.categoryName}'.`)
    };

    /**
     *
     * @param {Category} category
     */
    const onCreateCategoryClicked = (category) => {
        setCategoryDetailsModal({
            visible: false
        });
        addCategory(category)
        message.success(`Category '${category.categoryName}' created.`)
    };

    const onCategoryDetailCancel = () => {
        setCategoryDetailsModal({
           ...categoryDetailsModal,
            visible: false
        });
    }

    /**
     *
     * @param {Category} category
     */
    const onEditCategoryClicked = (category) => {
        setCategoryDetailsModal({
            visible: true,
            category: category
        });
    };

    /**
     *
     * @param {Category} category
     */
    const onDeleteCategoryClicked = (category) => {
        deleteCategory(category)
        message.success(`Category '${category.categoryName}' removed.`)
    };

    const onSearchChanges = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase();

        let filteredCategories = categories.filter(c => c.category
            && c.category.categoryName.toLocaleLowerCase().includes(lowerCaseText))
        filteredCategories.unshift(NEW_CATEGORY) // first element is a new category card
        setFilteredCategories(filteredCategories)
    }

    /**
     *
     * @param {Category} category
     */
    const showDeleteConfirm = (category) => {
        confirm({
            title: `Delete '${category.categoryName}' Category`,
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this category?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                onDeleteCategoryClicked(category)
            }
        });
    }

    const getTagsCount = questions => questionsToTags(questions).length

    const createPersonalMenu = (category) => <Menu>
        <Menu.Item onClick={e => {
            e.domEvent.stopPropagation()
            onEditCategoryClicked(category)
        }}>Edit category</Menu.Item>
        <Menu.Item danger onClick={e => {
            e.domEvent.stopPropagation()
            showDeleteConfirm(category)
        }}>Delete category</Menu.Item>
    </Menu>;

    return (
        <Layout pageHeader={
            <div className={styles.header}>
                <span className={styles.headerTitle}>My Interview Questions</span>
                <Space>
                    <Search placeholder="Search" allowClear className={styles.tabHeaderSearch}
                            onSearch={onSearchClicked}
                            onChange={onSearchChanges}
                    />
                    <Button>
                        <Link to={routeLibrary()}>
                            <span className="nav-text">Browse library</span>
                        </Link>
                    </Button>
                    <Button type="primary" onClick={onAddCategoryClicked}>Add category</Button>
                </Space>
            </div>
        }>
            <CategoryDetailsModal
                visible={categoryDetailsModal.visible}
                categoryToUpdate={categoryDetailsModal.category}
                onUpdate={onUpdateCategoryClicked}
                onCreate={onCreateCategoryClicked}
                onCancel={onCategoryDetailCancel}
            />
            <div style={{ marginTop: 24 }}>
                <Alert
                    message="Questions let you create and manage all your interview questions. They are grouped by category, like 'Java' or 'Leadership'. To help get you started quickly browse our Library, or add your unique questions. You can use questions when you create a template or interview."
                    type="info"
                    className={styles.infoAlert}
                    closable
                />
                <List
                    className={styles.categories}
                    grid={grid}
                    dataSource={filteredCategories}
                    loading={categoriesLoading}
                    renderItem={item => <List.Item>
                        <Card hoverable bodyStyle={{ padding: 0 }}>
                            {item !== NEW_CATEGORY &&
                            <div className={styles.card} onClick={() => onCategoryClicked(item.category)}>
                                <div className={styles.cardContainer}>
                                    <span className={styles.cardTitle}>{item.category.categoryName}</span>
                                    <Dropdown overlay={createPersonalMenu(item.category)}>
                                        <EllipsisOutlined style={{ fontSize: 20 }} onClick={e => e.stopPropagation()} />
                                    </Dropdown>
                                </div>

                                <div className={styles.cardContainer}>
                                    <span
                                        className={styles.cardMetaTitle}>{item.questions.length} QUESTIONS • {getTagsCount(item.questions)} TAGS</span>
                                    <ArrowRightIcon style={{ fontSize: 20 }} />
                                </div>
                            </div>}
                            {item === NEW_CATEGORY && <div className={styles.card} onClick={onAddCategoryClicked}>
                                <div className={styles.cardContainer}>
                                    <span className={styles.cardTitle}>New Category</span>
                                    <CustomIcon style={{ color: '#1F1F1F', fontSize: 18 }} />
                                </div>
                                <span
                                    className={styles.cardMetaTitle}>ADD YOUR QUESTIONS CATEGORY</span>
                            </div>}
                        </Card>
                    </List.Item>}
                />
            </div>
        </Layout>
    )
}

const mapStateToProps = state => {
    const questionBankState = state.questionBank || {};

    let categories = cloneDeep(questionBankState.categories)
    categories.unshift(NEW_CATEGORY) // first element is a new category card

    return {
        categories: categories,
        categoriesLoading: questionBankState.loading,
    };
};

export default connect(mapStateToProps, {
    loadQuestionBank,
    addCategory,
    deleteCategory,
    updateCategory,
})(QuestionBank);