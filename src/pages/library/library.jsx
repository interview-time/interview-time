import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { Alert, Avatar, Card, Input, List, Tooltip } from 'antd';
import styles from "./library.module.css";
import { useHistory } from "react-router-dom";
import { routeLibraryCategory } from "../../components/utils/route";
import { loadCommunityCategories } from "../../store/community-questions/actions";
import { cloneDeep } from "lodash/lang";
import { questionsToTags } from "../../components/utils/converters";
import { ArrowRightIcon } from "../../components/utils/icons";
import StickyHeader from "../../components/layout/header-sticky";

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
            <StickyHeader title="Interview Questions Library">
                <Search placeholder="Search" allowClear className={styles.headerSearch}
                        onSearch={onSearchClicked}
                        onChange={onSearchChanges}
                />
            </StickyHeader>
        } contentStyle={styles.pageContent}>
            <div>

                <Alert message="Library is a curated list of question to help you get started quickly."
                       className={styles.infoAlert}
                       type="info"
                       closable />

                <List
                    grid={grid}
                    dataSource={categoriesData}
                    loading={categoriesLoading}
                    renderItem={community => <List.Item>
                        <Card hoverable bodyStyle={{ padding: 0 }}>
                            <div className={styles.card} onClick={() => onCommunityClicked(community)}>
                                <div className={styles.cardContainer}>
                                    <span className={styles.cardTitle}>{community.category.categoryName}</span>
                                    <Tooltip title="By Interviewer.space">
                                        <Avatar size={24} src={INTERVIEWER_SPACE_AVATAR} />
                                    </Tooltip>
                                </div>

                                <div className={styles.cardContainer}>
                                    <span
                                        className={styles.cardMetaTitle}>{community.questions.length} QUESTIONS • {getTagsCount(community.questions)} TAGS</span>
                                    <ArrowRightIcon style={{ fontSize: 20 }} />
                                </div>
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