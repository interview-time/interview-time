import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { Avatar, Card, Col, Input, List, Row, Space, Tooltip } from 'antd';
import styles from "./library.module.css";
import { useHistory } from "react-router-dom";
import { routeLibraryCategory } from "../../components/utils/route";
import { getTemplateCategoryIcon, TemplateCategories } from "../../components/utils/constants";
import { loadCommunityCategories } from "../../store/community-questions/actions";
import { cloneDeep } from "lodash/lang";
import { questionsToTags } from "../../components/utils/converters";

const { Search } = Input;

const INTERVIEWER_SPACE_AVATAR = process.env.PUBLIC_URL + '/logo192.png'

const grid = {
    gutter: 16,
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 5,
};

const Library = ({ categories, categoriesLoading, loadCommunityCategories }) => {

    const history = useHistory();
    const [categoriesData, setCategoriesData] = useState([]);

    React.useEffect(() => {
        // first element is a suggest category card
        if ((!categories || categories.length <= 1) && !categoriesLoading) {
            loadCommunityCategories();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setCategoriesData(categories)
    }, [categories]);

    const onCommunityClicked = (community) => {
        history.push(routeLibraryCategory(community.category.categoryId))
    };

    const onSearchChanges = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase();

        // community
        let filteredCommunityCategories = categories.filter(community => community.category
            && community.category.categoryName.toLocaleLowerCase().includes(lowerCaseText))
        setCategoriesData(filteredCommunityCategories)
    }

    const getTagsCount = questions => questionsToTags(questions).length

    return (
        <Layout pageHeader={
            <div className={styles.header}>
                <span className={styles.headerTitle}>Interview Questions Library</span>
                <Search placeholder="Search" allowClear className={styles.headerSearch}
                        onSearch={onSearchClicked}
                        onChange={onSearchChanges}
                />
            </div>
        }>
            <div style={{ marginTop: 24 }}>
                <List
                    className={styles.categories}
                    grid={grid}
                    dataSource={categoriesData}
                    loading={categoriesLoading}
                    renderItem={community => <List.Item>
                        <Card hoverable bodyStyle={{ padding: 0, height: 190 }}>
                            <div className={styles.card}
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
                            </div>
                        </Card>
                    </List.Item>}
                />
            </div>
        </Layout>
    )
}

const mapStateToProps = state => {
    const communityQuestionsState = state.communityQuestions || {};

    // community
    const categories = cloneDeep(communityQuestionsState.categories)

    return {
        categories: categories,
        categoriesLoading: communityQuestionsState.loading
    };
};

export default connect(mapStateToProps, {
    loadCommunityCategories
})(Library);