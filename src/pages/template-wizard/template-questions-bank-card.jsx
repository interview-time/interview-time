import React, { useState } from "react";
import styles from "./template-questions.module.css";
import { Divider, Select, Space, Table } from 'antd';
import Text from "antd/lib/typography/Text";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { localeCompare } from "../../components/utils/comparators";

/**
 *
 * @param {CategoryHolder[]} categories
 * @param {Question[]} groupQuestions
 * @param onAddQuestionClicked
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateQuestionsBankCard = ({ categories, groupQuestions, onAddQuestionClicked }) => {

    /**
     * @type {CategoryHolder}
     */
    const emptyCategory = {
        category : {
            categoryName: null
        },
        questions: []
    }

    /**
     * @type {Question[]}
     */
    const emptyQuestions = []

    const [selectedCategory, setSelectedCategory] = useState(emptyCategory)
    const [selectedCategoryQuestions, setSelectedCategoryQuestions] = useState(emptyQuestions)

    React.useEffect(() => {
        // select first category when categories are loaded
        if (categories.length !== 0 && !selectedCategory.categoryId) {
            setSelectedCategory(categories[0])
        }
        // eslint-disable-next-line
    }, [categories]);

    React.useEffect(() => {
        let categoryQuestions = selectedCategory.questions

        // show selected category questions without questions in the group
        let filteredQuestions = categoryQuestions
            .filter(question => !groupQuestions.find(element => element.questionId === question.questionId));

        setSelectedCategoryQuestions(filteredQuestions)

    }, [selectedCategory, categories, groupQuestions]);

    const onCategoryChange = categoryId => {
        setSelectedCategory(categories.find(c => c.category.categoryId === categoryId))
    };

    const onRowClicked = (question) => {
        onAddQuestionClicked(question)
    }

    const columns = [
        {
            title: 'Question',
            key: 'question',
            dataIndex: 'question',
            fixed: 'left',
            sortDirections: ['descend', 'ascend'],
            className: styles.multiLineText,
            sorter: (a, b) => localeCompare(a.question, b.question),
        },
        {
            key: 'action',
            width: 24,
            render: () => <PlusCircleTwoTone className={styles.removeIcon} />
        }
    ];

    return (
        <div className={styles.cardContainerQuestionBank}>
            <div className={styles.cardHeaderSticky}>
                <Space direction="vertical" size={4}>
                    <Text strong>Questions</Text> <Text>{selectedCategoryQuestions.length} questions</Text>
                </Space>
                <Space>
                    <Select
                        key={selectedCategory.category.categoryId}
                        placeholder="Select category"
                        defaultValue={selectedCategory.category.categoryName}
                        onSelect={onCategoryChange}
                        style={{ width: 180 }}
                        options={categories.map(category => ({
                            label: category.category.categoryName,
                            value: category.category.categoryId }))
                        }
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.label.toLocaleLowerCase().includes(inputValue)
                        }
                    />
                </Space>
            </div>
            <Divider className={styles.divider} />
            <div className={styles.table}>
                <Table
                    rowKey="index"
                    pagination={false}
                    showHeader={false}
                    dataSource={selectedCategoryQuestions}
                    columns={columns}
                    rowClassName={styles.row}
                    onRow={record => ({
                        onClick: () => onRowClicked(record),
                    })}
                />
            </div>
        </div>
    );
}

export default TemplateQuestionsBankCard;