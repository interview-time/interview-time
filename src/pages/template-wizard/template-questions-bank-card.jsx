import React, { useState } from "react";
import styles from "./template-questions.module.css";
import { Divider, Select, Space, Table } from 'antd';
import Text from "antd/lib/typography/Text";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { filterQuestionCategory } from "../../components/utils/filters";
import { localeCompare } from "../../components/utils/comparators";

const TemplateQuestionsBankCard = ({ questions, categories, groupQuestions, onAddQuestionClicked }) => {

    const [selectedCategory, setSelectedCategory] = useState()
    const [selectedCategoryQuestions, setSelectedCategoryQuestions] = useState([])

    React.useEffect(() => {
        // select first category when categories are loaded
        if (categories.length !== 0 && !selectedCategory) {
            setSelectedCategory(categories[0])
        }
        // eslint-disable-next-line
    }, [categories]);

    React.useEffect(() => {
        // console.log(questions)
        if (questions.length !== 0 && selectedCategory && groupQuestions) {
            const categoryQuestions = filterQuestionCategory(questions, selectedCategory)

            // show selected category questions without questions in the group
            let filteredQuestions = categoryQuestions
                .filter(question => !groupQuestions.find(element => element.questionId === question.questionId));

            setSelectedCategoryQuestions(filteredQuestions)
        }
    }, [selectedCategory, questions, groupQuestions]);

    const onCategoryChange = category => {
        setSelectedCategory(category)
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
                        key={selectedCategory}
                        placeholder="Select category"
                        defaultValue={selectedCategory}
                        onSelect={onCategoryChange}
                        style={{ width: 180 }}
                        options={categories.map(category => ({ value: category }))}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.value.toLocaleLowerCase().includes(inputValue)
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