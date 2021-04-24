import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { addCategory, deleteCategory, loadQuestionBank, updateCategory } from "../../store/question-bank/actions";
import { Avatar, Button, Card, Col, Dropdown, Input, List, Menu, message, Row, Space, Tooltip } from 'antd';
import styles from "./question-bank.module.css";
import CategoryDetailsModal from "./modal-category-details";
import collection from "lodash/collection";
import { Link, useHistory } from "react-router-dom";
import { routeLibrary, routeQuestionBankCategory, routeTemplateAdd } from "../../components/utils/route";
import { getTemplateCategoryIcon, TemplateCategories } from "../../components/utils/constants";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { CustomIcon } from "../../components/utils/icons";
import confirm from "antd/lib/modal/confirm";
import { useAuth0 } from "../../react-auth0-spa";
import { questionsToTags } from "../../components/utils/converters";

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

const QuestionBank = ({
                          personalCategories,
                          personalCategoriesLoading,
                          loadQuestionBank,
                          addCategory,
                          deleteCategory,
                          updateCategory,
                      }) => {

    const history = useHistory();
    const { user } = useAuth0();
    const [personalCategoriesData, setPersonalCategoriesData] = useState([]);

    const [categoryDetailsModal, setCategoryDetailsModal] = useState({
        category: '',
        visible: false
    });

    React.useEffect(() => {
        // first element is a new category card
        if ((!personalCategories || personalCategories.length <= 1) && !personalCategoriesLoading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
            setPersonalCategoriesData(personalCategories)
    }, [personalCategories]);

    const onCategoryClicked = (category) => {
        history.push(routeQuestionBankCategory(category.categoryName))
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
        message.success(`Category '${oldCategory}' renamed to '${newCategory}'.`)
    };

    const onCreateCategoryClicked = (category) => {
        setCategoryDetailsModal({
            visible: false,
            category: ''
        });
        addCategory(category)
        message.success(`Category '${category}' created.`)
    };

    const onCategoryDetailCancel = () => {
        setCategoryDetailsModal({
            visible: false,
            category: ''
        });
    }

    const onEditCategoryClicked = (category) => {
        setCategoryDetailsModal({
            visible: true,
            category: category.categoryName
        });
    };

    const onDeleteCategoryClicked = (category) => {
        deleteCategory(category.categoryName)
        message.success(`Category '${category.categoryName}' removed.`)
    };

    const onSearchChanges = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase();

        // personal
        let filteredPersonalCategories =  personalCategories.filter(personal => personal.category
            && personal.category.categoryName.toLocaleLowerCase().includes(lowerCaseText))
        filteredPersonalCategories.unshift(NEW_CATEGORY) // first element is a new category card
        setPersonalCategoriesData(filteredPersonalCategories)
    }

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

    const getUserName = () => {
        if (user && user.name) {
            return user.name;
        }
        return 'Unknown User'
    }

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
            <div style={{marginTop: 24}}>
                <List
                    className={styles.categories}
                    grid={grid}
                    dataSource={personalCategoriesData}
                    loading={personalCategoriesLoading}
                    renderItem={personal => <List.Item>
                        <Card hoverable bodyStyle={{ padding: 0, height: 190 }}>
                            {personal !== NEW_CATEGORY &&
                            <div className={styles.card} onClick={() => onCategoryClicked(personal.category)}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {getTemplateCategoryIcon("")}
                                    {/*Temporary hard code category*/}
                                    <div style={{ color: TemplateCategories[0].color }}
                                         className={styles.category}>{TemplateCategories[0].titleShort}</div>
                                    <div style={{ flexGrow: 1 }} />
                                    <Dropdown overlay={createPersonalMenu(personal.category)}>
                                        <EllipsisOutlined style={{ fontSize: 20 }} onClick={e => e.stopPropagation()} />
                                    </Dropdown>
                                </div>
                                <div className={styles.cardTitle}>{personal.category.categoryName}</div>

                                <Row style={{ marginTop: 12 }}>
                                    <Col span={12}>
                                        <div className={styles.cardMetaTitle}>QUESTIONS</div>
                                        <div className={styles.cardMetaValue}>{personal.questions.length}</div>
                                    </Col>
                                    <Col span={12}>
                                        <div className={styles.cardMetaTitle}>TAGS</div>
                                        <div className={styles.cardMetaValue}>{getTagsCount(personal.questions)}</div>
                                    </Col>
                                </Row>

                                <Tooltip title="Author">
                                    <Space style={{ marginTop: 12 }}>
                                        <Avatar size={24} src={user ? user.picture : null} />
                                        <span className={styles.author}>{getUserName()}</span>
                                    </Space>
                                </Tooltip>
                            </div>}
                            {personal === NEW_CATEGORY && <div className={styles.card} onClick={onAddCategoryClicked}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <CustomIcon style={{ color: '#1F1F1F', fontSize: 18 }} />
                                    <div className={styles.category}>CUSTOM</div>
                                </div>
                                <div className={styles.cardTitle}>New Category</div>
                                <div className={styles.author}>
                                    To make sure you’re asking a consistent set of questions, create your own question
                                    bank.
                                </div>
                                <div className={styles.cardActionButton}>
                                    <Button type="link">Add category</Button>
                                </div>
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

    // personal
    let categories = questionBankState.categories.sort()
    let questions = collection.sortBy(questionBankState.questions, ['question'])
    let personalCategories = []
    personalCategories.push(NEW_CATEGORY) // first element is a new category card
    categories.forEach(category => {
        personalCategories.push({
            category: {
                categoryName: category,
            },
            questions: questions.filter(question => question.category === category)
        })
    })

    return {
        personalCategories: personalCategories,
        personalCategoriesLoading: questionBankState.loading,
    };
};

export default connect(mapStateToProps, {
    loadQuestionBank,
    addCategory,
    deleteCategory,
    updateCategory,
})(QuestionBank);