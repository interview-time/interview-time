import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import {
    addCategory,
    addQuestion,
    addQuestions,
    deleteCategory,
    deleteQuestion,
    loadQuestionBank,
    updateCategory,
    updateQuestion
} from "../../store/question-bank/actions";
import { message, PageHeader } from 'antd';
import styles from "./question-bank.module.css";
import CategoryDetailsModal from "./modal-category-details";
import QuestionBankCategories from "./question-bank-categories";
import QuestionBankQuestions from "./question-bank-questions";
import collection from "lodash/collection";

const STATE_CATEGORIES = "categories"
const STATE_CATEGORY_DETAILS = "category-details"

const QuestionBank = ({
                          categories,
                          questions,
                          loading,
                          loadQuestionBank,
                          addQuestion,
                          addQuestions,
                          updateQuestion,
                          deleteQuestion,
                          addCategory,
                          deleteCategory,
                          updateCategory,
                      }) => {

    const [state, setState] = useState(STATE_CATEGORIES);

    const [selectedCategory, setSelectedCategory] = useState({});

    const [categoryDetailsModal, setCategoryDetailsModal] = useState({
        category: '',
        visible: false
    });

    React.useEffect(() => {
        if ((!questions || questions.length === 0) && !loading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

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

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Question Bank"
        />}>
            <CategoryDetailsModal
                visible={categoryDetailsModal.visible}
                categoryToUpdate={categoryDetailsModal.category}
                onUpdate={onUpdateCategoryClicked}
                onCreate={onCreateCategoryClicked}
                onCancel={onCategoryDetailCancel}
            />
            {isCategoriesState() && <QuestionBankCategories
                categories={categories}
                questions={questions}
                loading={loading}
                onCategoryClicked={onCategoryClicked}
                onAddCategoryClicked={onAddCategoryClicked}
                onEditCategoryClicked={onEditCategoryClicked}
                onDeleteCategoryClicked={onDeleteCategoryClicked}
            />}
            {isCategoryDetailsState() && <QuestionBankQuestions
                selectedCategory={selectedCategory}
                questions={questions}
                addQuestion={addQuestion}
                addQuestions={addQuestions}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
                onBackToCategoriesClicked={onBackToCategoriesClicked}
            />}
        </Layout>
    )
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
    loadQuestionBank,
    addQuestion,
    addQuestions,
    updateQuestion,
    deleteQuestion,
    addCategory,
    deleteCategory,
    updateCategory
})(QuestionBank);