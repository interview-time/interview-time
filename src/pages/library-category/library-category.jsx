import styles from "./library-category.module.css";
import { Button, Card, Dropdown, Input, Menu, message, Select, Space, Table, Tag, Typography } from "antd";
import React, { useState } from "react";
import { localeCompare, localeCompareArray, localeCompareDifficult } from "../../components/utils/comparators";
import { Difficulty } from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import { filterQuestionDifficulty, filterQuestionTag, filterQuestionText } from "../../components/utils/filters";
import Layout from "../../components/layout/layout";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { loadCommunityCategories } from "../../store/community-questions/actions";
import { questionsToTags } from "../../components/utils/converters";
import { cloneDeep } from "lodash/lang";
import Text from "antd/lib/typography/Text";
import { addQuestions, loadQuestionBank } from "../../store/question-bank/actions";
import RequestQuestionModal from "./modal-request-question";
import collection from "lodash/collection";
import StickyHeader from "../../components/layout/header-sticky";

const { Link } = Typography;
const { Search } = Input;

/**
 *
 * @param {Category[]} personalCategories
 * @param {boolean} personalCategoriesLoading
 * @param {CategoryHolder[]} communityCategories
 * @param {boolean} communityCategoriesLoading
 * @param loadQuestionBank
 * @param loadCommunityCategories
 * @param addQuestions
 * @returns {JSX.Element}
 * @constructor
 */
const LibraryCategory = (
    {
        personalCategories,
        personalCategoriesLoading,
        communityCategories,
        communityCategoriesLoading,
        loadQuestionBank,
        loadCommunityCategories,
        addQuestions
    }) => {

    const [category, setCategory] = useState({});
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
    const [categoryTags, setCategoryTags] = useState([])
    const [personalCategoriesPicker, setPersonalCategoriesPicker] = useState([])
    const [selectedPersonalCategory, setSelectedPersonalCategory] = useState()

    // filter
    const [textFilter, setTextFilter] = useState()
    const [difficultyFilter, setDifficultyFilter] = useState()
    const [tagFilter, setTagFilter] = useState()

    const [requestQuestionVisible, setRequestQuestionVisible] = useState(false);

    const { id } = useParams();
    useHistory();
    React.useEffect(() => {
        if (communityCategories.length === 0 && !communityCategoriesLoading) {
            loadCommunityCategories();
        }

        if (personalCategories.length === 0 && !personalCategoriesLoading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        const community = communityCategories.find(community => community.category.categoryId === id);
        if (community) {
            setCategory(community.category)

            let questions = collection.orderBy(
                cloneDeep(community.questions),
                ['createdDate'], ['asc']
            )
            questions.forEach(question => {
                question.key = question.questionId
            })
            setQuestions(questions)
            setFilteredQuestions(questions)

            setCategoryTags(questionsToTags(questions)
                .sort()
                .map(tag => ({ value: tag }))
            )
        }
        // eslint-disable-next-line
    }, [communityCategories]);

    React.useEffect(() => {
        setPersonalCategoriesPicker(
            personalCategories.map(category => ({
                value: category.categoryId,
                label: category.categoryName,
            }))
        )
        // eslint-disable-next-line
    }, [personalCategories]);

    React.useEffect(() => {
        let filteredQuestions = questions
        if (textFilter && textFilter.length !== '') {
            filteredQuestions = filterQuestionText(questions, textFilter)
        }

        if (difficultyFilter) {
            filteredQuestions = filterQuestionDifficulty(questions, difficultyFilter)
        }

        if (tagFilter) {
            filteredQuestions = filterQuestionTag(questions, tagFilter)
        }

        if (questions.length !== 0) {
            setFilteredQuestions(filteredQuestions)
        }
        // eslint-disable-next-line
    }, [textFilter, difficultyFilter, tagFilter]);


    const onAddQuestionsClicked = () => {
        if (selectedPersonalCategory) {
            let selectedQuestions = []
            selectedQuestionIds.forEach(questionId => {
                let question = cloneDeep(questions.find(question => question.questionId === questionId))
                question.parentQuestionId = question.questionId
                question.categoryId = selectedPersonalCategory.categoryId
                question.category = selectedPersonalCategory.categoryName
                selectedQuestions.push(question)
            })

            addQuestions(selectedQuestions)
            message.success(`'${selectedQuestionIds.length}' questions added to your personal question bank.`)
            setSelectedQuestionIds([])
        }
    }

    const onAddQuestionClicked = (event, questionId) => {
        let selectedPersonalCategory = personalCategories.find(category => category.categoryId === event.key)
        let question = cloneDeep(questions.find(question => question.questionId === questionId))
        question.parentQuestionId = question.questionId
        question.categoryId = selectedPersonalCategory.categoryId
        question.category = selectedPersonalCategory.categoryName

        addQuestions([question])
        message.success(`Question added to your personal question bank.`)
        setSelectedQuestionIds([])
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

    const onRequestQuestionClicked = () => {
        setRequestQuestionVisible(true)
    }

    const onRequestQuestionClose = () => {
        setRequestQuestionVisible(false)
    }
    const onPersonalCategoryChange = value => {
        setSelectedPersonalCategory(personalCategories.find(category => category.categoryId === value))
    }

    const onSelectChange = selectedRowKeys => {
        setSelectedQuestionIds(selectedRowKeys)
    };

    const rowSelection = {
        selectedRowKeys: selectedQuestionIds,
        onChange: onSelectChange,
    };

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
        {
            key: 'actions',
            width: 160,
            render: record => (
                <>
                    <Dropdown overlay={
                        <Menu onClick={e => onAddQuestionClicked(e, record.questionId)}>
                            {personalCategories.map(category => <Menu.Item key={category.categoryId}>{category.categoryName}</Menu.Item>)}
                        </Menu>
                    }>
                        <Link link>Add to Personal</Link>
                    </Dropdown>
                </>
            ),
        },
    ]

    return (
        <Layout pageHeader={
            <StickyHeader title={category.categoryName} backButton>
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
                        key={categoryTags}
                        placeholder="Tag"
                        allowClear
                        onSelect={onTagChange}
                        onClear={onTagClear}
                        options={categoryTags}
                        style={{ width: 125 }}
                    />
                </Space>
                <Button onClick={onRequestQuestionClicked}>Suggest question</Button>
            </StickyHeader>
        } contentStyle={styles.pageContent}>
            <RequestQuestionModal
                visible={requestQuestionVisible}
                onCancel={onRequestQuestionClose}
            />
            <div className={styles.container}>

                <div className={styles.tableContainer}>
                    <Table
                        className={styles.table}
                        columns={columns}
                        pagination={false}
                        loading={communityCategoriesLoading}
                        dataSource={filteredQuestions}
                        rowSelection={rowSelection}
                    />
                </div>

                {selectedQuestionIds.length !== 0 && <Card className={styles.selectionCard}>
                    <div className={styles.selection}>
                        <Text strong>{selectedQuestionIds.length} questions</Text>
                        <Space size={16}>
                            <Select
                                className={styles.selectPersonal}
                                placeholder="Select category"
                                onSelect={onPersonalCategoryChange}
                                options={personalCategoriesPicker}
                                showSearch
                                filterOption={(inputValue, option) =>
                                    option.value.toLocaleLowerCase().includes(inputValue)
                                }
                            />
                            <Button disabled={!selectedPersonalCategory}
                                    onClick={onAddQuestionsClicked}
                                    type="primary">Add to Personal</Button>
                        </Space>
                    </div>
                </Card>}
            </div>
        </Layout>
    )
}

const mapStateToProps = state => {
    const communityQuestionsState = state.communityQuestions || {};
    const questionBankState = state.questionBank || {};

    return {
        personalCategories: questionBankState.categories.map(c => c.category),
        personalCategoriesLoading: questionBankState.loading,
        communityCategories: communityQuestionsState.categories,
        communityCategoriesLoading: communityQuestionsState.loading
    };
};

const mapDispatch = {
    loadCommunityCategories,
    loadQuestionBank,
    addQuestions,
}

export default connect(mapStateToProps, mapDispatch)(LibraryCategory)