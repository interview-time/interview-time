import React, { useState } from 'react';
import { connect } from "react-redux";
import {
    addCategory,
    addQuestion,
    deleteCategory,
    deleteQuestion,
    updateCategory,
    updateQuestion
} from "../../store/question-bank/actions";
import CategoryDetailsModal from "../question-bank/modal-category-details";
import collection from "lodash/collection";
import QuestionBankPersonalCategories from "./question-bank-personal-categories";
import QuestionBankPersonalQuestions from "./question-bank-personal-questions";
import { message } from "antd";

const STATE_CATEGORIES = "categories"
const STATE_CATEGORY_DETAILS = "category-details"

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

    const [categoryDetailsModal, setCategoryDetailsModal] = useState({
        category: '',
        visible: false
    });

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
                onEditCategoryClicked={onEditCategoryClicked}
                onDeleteCategoryClicked={onDeleteCategoryClicked}
            />}
            {isCategoryDetailsState() && <QuestionBankPersonalQuestions
                selectedCategory={selectedCategory}
                questions={questions}
                addQuestion={addQuestion}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
                onBackToCategoriesClicked={onBackToCategoriesClicked}
            />}
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