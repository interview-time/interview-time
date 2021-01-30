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

    const onEditCategoryClicked = () => {
        setCategoryDetailsModal({
            visible: true,
            category: selectedCategory.categoryName
        });
    };

    const onDeleteCategoryClicked = () => {
        deleteCategory(selectedCategory.categoryName)
        setState(STATE_CATEGORIES)
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
            {isCategoryDetailsState() && <QuestionBankPersonalQuestions
                selectedCategory={selectedCategory}
                questions={questions}
                addQuestion={addQuestion}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
                onBackToCategoriesClicked={onBackToCategoriesClicked}
                onEditCategoryClicked={onEditCategoryClicked}
                onDeleteCategoryClicked={onDeleteCategoryClicked}
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