import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { addCategory, deleteCategory, loadQuestionBank, updateCategory } from "../../store/question-bank/actions";
import { message, PageHeader } from 'antd';
import styles from "./question-bank.module.css";
import CategoryDetailsModal from "./modal-category-details";
import QuestionBankCategories from "./question-bank-categories";
import collection from "lodash/collection";
import { useHistory } from "react-router-dom";
import { routeQuestionBankCategory } from "../../components/utils/route";


const QuestionBank = ({
                          categories,
                          questions,
                          loading,
                          loadQuestionBank,
                          addCategory,
                          deleteCategory,
                          updateCategory,
                      }) => {

    const [categoryDetailsModal, setCategoryDetailsModal] = useState({
        category: '',
        visible: false
    });

    const history = useHistory();

    React.useEffect(() => {
        if ((!questions || questions.length === 0) && !loading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

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
            <QuestionBankCategories
                categories={categories}
                questions={questions}
                loading={loading}
                onCategoryClicked={onCategoryClicked}
                onAddCategoryClicked={onAddCategoryClicked}
                onEditCategoryClicked={onEditCategoryClicked}
                onDeleteCategoryClicked={onDeleteCategoryClicked}
            />
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
    addCategory,
    deleteCategory,
    updateCategory
})(QuestionBank);