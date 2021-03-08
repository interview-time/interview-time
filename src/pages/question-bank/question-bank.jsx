import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { addCategory, deleteCategory, loadQuestionBank, updateCategory } from "../../store/question-bank/actions";
import { Avatar, Button, Card, Col, Dropdown, Input, List, Menu, message, PageHeader, Row, Space, Tooltip } from 'antd';
import styles from "./question-bank.module.css";
import CategoryDetailsModal from "./modal-category-details";
import collection from "lodash/collection";
import { useHistory } from "react-router-dom";
import { routeCommunityCategory, routeQuestionBankCategory } from "../../components/utils/route";
import { getTemplateCategoryIcon, TemplateCategories } from "../../components/utils/constants";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { CustomIcon } from "../../components/utils/icons";
import confirm from "antd/lib/modal/confirm";
import { useAuth0 } from "../../react-auth0-spa";
import { loadCommunityCategories } from "../../store/community-questions/actions";
import { cloneDeep } from "lodash/lang";
import RequestCategoryModal from "../question-bank-community/modal-request-category";
import { questionsToTags } from "../../components/utils/converters";

const { Search } = Input;

const NEW_CATEGORY = "NEW_CATEGORY"
const SUGGEST_CATEGORY = "SUGGEST_CATEGORY"
const INTERVIEWER_SPACE_AVATAR = process.env.PUBLIC_URL + '/logo192.png'

const grid = {
    gutter: 16,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    xxl: 5,
};

const QuestionBank = ({
                          personalCategories,
                          personalCategoriesLoading,
                          communityCategories,
                          communityCategoriesLoading,
                          loadQuestionBank,
                          addCategory,
                          deleteCategory,
                          updateCategory,
                          loadCommunityCategories
                      }) => {

    const history = useHistory();
    const { user } = useAuth0();
    const [personalCategoriesData, setPersonalCategoriesData] = useState([]);
    const [communityCategoriesData, setCommunityCategoriesData] = useState([]);

    const [categoryDetailsModal, setCategoryDetailsModal] = useState({
        category: '',
        visible: false
    });

    const [requestCategoryVisible, setRequestCategoryVisible] = useState(false);

    React.useEffect(() => {
        // first element is a new category card
        if ((!personalCategories || personalCategories.length <= 1) && !personalCategoriesLoading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        // first element is a suggest category card
        if ((!communityCategories || communityCategories.length <= 1) && !communityCategoriesLoading) {
            loadCommunityCategories();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
            setPersonalCategoriesData(personalCategories)
    }, [personalCategories]);

    React.useEffect(() => {
        setCommunityCategoriesData(communityCategories)
    }, [communityCategories]);

    const onCategoryClicked = (category) => {
        history.push(routeQuestionBankCategory(category.categoryName))
    };

    const onCommunityClicked = (community) => {
        history.push(routeCommunityCategory(community.category.categoryId))
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

        // community
        let filteredCommunityCategories =  communityCategories.filter(community => community.category
            && community.category.categoryName.toLocaleLowerCase().includes(lowerCaseText))
        filteredCommunityCategories.unshift(SUGGEST_CATEGORY) // first element is suggest category card
        setCommunityCategoriesData(filteredCommunityCategories)
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

    const onRequestCategoryClicked = () => {
        setRequestCategoryVisible(true)
    }

    const onRequestCategoryClose = () => {
        setRequestCategoryVisible(false)
    }

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Question Bank"
            extra={[
                <Search placeholder="Search" allowClear enterButton className={styles.tabHeaderSearch}
                        onSearch={onSearchClicked}
                        onChange={onSearchChanges}
                />
            ]}
        />}>
            <CategoryDetailsModal
                visible={categoryDetailsModal.visible}
                categoryToUpdate={categoryDetailsModal.category}
                onUpdate={onUpdateCategoryClicked}
                onCreate={onCreateCategoryClicked}
                onCancel={onCategoryDetailCancel}
            />
            <RequestCategoryModal
                visible={requestCategoryVisible}
                onCancel={onRequestCategoryClose}
            />
            <div>
                <span className={styles.personal}>Personal</span>
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
            <div style={{ marginTop: 24 }}>
                <span className={styles.community}>Community</span>
                <List
                    className={styles.categories}
                    grid={grid}
                    dataSource={communityCategoriesData}
                    loading={communityCategoriesLoading}
                    renderItem={community => <List.Item>
                        <Card hoverable bodyStyle={{ padding: 0, height: 190 }}>
                            {community !== SUGGEST_CATEGORY && <div className={styles.card}
                                                                    onClick={() => onCommunityClicked(community)}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {getTemplateCategoryIcon("")}
                                    {/*Temporary hard code category*/}
                                    <div style={{ color: TemplateCategories[0].color }}
                                         className={styles.category}>{TemplateCategories[0].titleShort}</div>
                                    <div style={{ flexGrow: 1 }} />
                                </div>
                                <div className={styles.cardTitle}>{community.category.categoryName}</div>

                                <Row style={{ marginTop: 12 }}>
                                    <Col span={12}>
                                        <div className={styles.cardMetaTitle}>QUESTIONS</div>
                                        <div className={styles.cardMetaValue}>{community.questions.length}</div>
                                    </Col>
                                    <Col span={12}>
                                        <div className={styles.cardMetaTitle}>TAGS</div>
                                        <div className={styles.cardMetaValue}>{getTagsCount(community.questions)}</div>
                                    </Col>
                                </Row>

                                <Tooltip title="Author">
                                    <Space style={{ marginTop: 12 }}>
                                        <Avatar size={24} src={INTERVIEWER_SPACE_AVATAR} />
                                        <span className={styles.author}>Interviewer.space</span>
                                    </Space>
                                </Tooltip>
                            </div>}
                            {community === SUGGEST_CATEGORY && <div className={styles.card} onClick={onRequestCategoryClicked}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <CustomIcon style={{ color: '#1F1F1F', fontSize: 18 }} />
                                    <div className={styles.category}>CUSTOM</div>
                                </div>
                                <div className={styles.cardTitle}>Suggest Category</div>
                                <div className={styles.author}>
                                    Missing a category? Tell us about the category you need, and we will add it.
                                </div>
                                <div className={styles.cardActionButton}>
                                    <Button type="link">Suggest category</Button>
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
    const communityQuestionsState = state.communityQuestions || {};

    // community
    const communityCategories = cloneDeep(communityQuestionsState.categories)
    communityCategories.unshift(SUGGEST_CATEGORY) // first element is a suggest category card

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
        communityCategories: communityCategories,
        communityCategoriesLoading: communityQuestionsState.loading
    };
};

export default connect(mapStateToProps, {
    loadQuestionBank,
    addCategory,
    deleteCategory,
    updateCategory,
    loadCommunityCategories
})(QuestionBank);