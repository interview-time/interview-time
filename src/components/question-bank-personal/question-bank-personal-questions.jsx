import QuestionDetailsModal from "../question-bank/modal-question-details";
import { Button, Card, Dropdown, Input, Menu, Space, Table, Tag } from "antd";
import styles from "./question-bank.module.css";
import { ArrowLeftOutlined, MoreOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { arrayComparator, stringComparator } from "../utils/comparators";
import { Link } from "react-router-dom";
import { getDifficultyColor } from "../utils/constants";

const { Search } = Input;

const KEY_DELETE = "delete"
const KEY_EDIT = "edit"

const QuestionBankPersonalQuestions = ({
                                           selectedCategory,
                                           questions,
                                           addQuestion,
                                           updateQuestion,
                                           deleteQuestion,
                                           onBackToCategoriesClicked,
                                           onDeleteCategoryClicked,
                                           onEditCategoryClicked
                                       }) => {

    const columns = [
        {
            title: 'Question',
            key: 'question',
            dataIndex: 'question',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => stringComparator(a.question, b.question),
            render: (question, record) => (
                <Link className={styles.questionLink} onClick={() => onQuestionClicked(record)}>{question}</Link>
            ),
        },
        {
            title: 'Difficulty',
            key: 'difficulty',
            dataIndex: 'difficulty',
            width: 125,
            sorter: (a, b) => stringComparator(a.difficulty, b.difficulty),
            render: difficulty => (
                <Tag key={difficulty} color={getDifficultyColor(difficulty)}>
                    {difficulty}
                </Tag>
            )
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: 250,
            sorter: (a, b) => arrayComparator(a.tags, b.tags),
            render: tags => (
                <>
                    {(tags ? tags : []).map(tag => {
                        return (
                            <Tag className={styles.tag} key={tag} onClick={() => {
                                onTagClicked(tag)
                            }}>
                                {tag.toLowerCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
    ]

    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const [questionDetailModal, setQuestionDetailModal] = useState({
        question: {},
        visible: false
    });

    const questionSearchRef = React.useRef(null);

    React.useEffect(() => {
        setSelectedQuestions(questions.filter(question => question.category === selectedCategory.categoryName))
    }, [selectedCategory, questions]);

    const onAddQuestionClicked = () => {
        setQuestionDetailModal({
            question: null,
            visible: true
        })
    }

    const onUpdateQuestionClicked = (question) => {
        if (question.questionId) {
            updateQuestion(question)
        } else {
            addQuestion({
                ...question,
                category: selectedCategory.categoryName,
            })
        }
        setQuestionDetailModal({
            question: null,
            visible: false
        })
    };

    const onRemoveQuestionClicked = (question) => {
        deleteQuestion(question.questionId)
        setQuestionDetailModal({
            question: null,
            visible: false
        })
    };

    const onQuestionDetailCancel = () => {
        setQuestionDetailModal({
            question: null,
            visible: false
        })
    };

    const onQuestionClicked = (question) => {
        setQuestionDetailModal({
            question: question,
            visible: true
        })
    }

    const onMenuClicked = (e) => {
        if(e.key === KEY_DELETE) {
            onDeleteCategoryClicked()
        }  else if(e.key === KEY_EDIT) {
            onEditCategoryClicked()
        }
    };

    const categoryMenu = (
        <Menu onClick={onMenuClicked}>
            <Menu.Item key={KEY_EDIT}>Edit Category</Menu.Item>
            <Menu.Item key={KEY_DELETE}>Delete Category</Menu.Item>
        </Menu>
    );

    const onTagClicked = tag => {
        let text = `[${tag}]`
        questionSearchRef.current.setValue(text)
        onQuestionSearchClicked(text)
    }

    const onQuestionSearchChanges = e => {
        onQuestionSearchClicked(e.target.value)
    };

    const onQuestionSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase();
        if(lowerCaseText.includes('[') || lowerCaseText.includes(']')) { // tag search
            lowerCaseText = lowerCaseText.replace('[', '')
            lowerCaseText = lowerCaseText.replace(']', '')
            setSelectedQuestions(
                questions.filter(question => question.category === selectedCategory.categoryName
                    && question.tags.find(tag => tag.toLocaleLowerCase().includes(lowerCaseText)))
            )
        } else {
            setSelectedQuestions(
                questions.filter(question => question.category === selectedCategory.categoryName
                    && question.question.toLocaleLowerCase().includes(lowerCaseText))
            )
        }
    };

    return (
        <div>
            <QuestionDetailsModal
                visible={questionDetailModal.visible}
                questionToUpdate={questionDetailModal.question}
                onCreate={(question) => onUpdateQuestionClicked(question)}
                onCancel={onQuestionDetailCancel}
                onRemove={(question) => onRemoveQuestionClicked(question)}
            />
            <Card>
                <div className={styles.tabHeader}>
                    <Button type="link" icon={<ArrowLeftOutlined />}
                            onClick={onBackToCategoriesClicked}>{selectedCategory.categoryName}</Button>
                    <div className={styles.space} />
                    <Space>
                        <Search placeholder="Search" allowClear ref={questionSearchRef}
                                enterButton className={styles.tabHeaderSearch}
                                onSearch={onQuestionSearchClicked}
                                onChange={onQuestionSearchChanges}
                        />
                        <Button type="primary" onClick={() => onAddQuestionClicked()}>Add question</Button>

                        <Dropdown overlay={categoryMenu}>
                            <Button icon={<MoreOutlined />} />
                        </Dropdown>
                    </Space>
                </div>
            </Card>

            <Table columns={columns}
                   pagination={false}
                   style={{ marginTop: 24 }}
                   dataSource={selectedQuestions} />
        </div>
    )

}

export default QuestionBankPersonalQuestions