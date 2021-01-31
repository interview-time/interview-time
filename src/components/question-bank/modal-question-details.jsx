import styles from "./modal-question-details.module.css"
import { Button, Drawer, Form, Input, Radio, Select, Space } from "antd";
import React, { useState } from "react";
import lang from "lodash/lang";
import { Difficulty } from "../utils/constants";
import { defaultTo } from "lodash/util";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const QuestionDetailsModal = ({ visible, onCreate, onRemove, onCancel, questionToUpdate, tags }) => {

    const difficultOptions = [
        Difficulty.EASY,
        Difficulty.MEDIUM,
        Difficulty.HARD,
    ];

    const noError = {
        status: null,
        help: null,
    }

    const emptyQuestion = {
        tags: [],
        question: '',
        difficulty: Difficulty.EASY,
    }

    const [questionId, setQuestionId] = useState();
    const [question, setQuestion] = useState(emptyQuestion);
    const [error, setError] = useState(noError);

    React.useEffect(() => {
        if (visible) {
            setQuestion(questionToUpdate ? lang.cloneDeep(questionToUpdate) : emptyQuestion)
            setQuestionId(questionToUpdate ? questionToUpdate.questionId : Date.now())
            setError(noError)
        }
        // eslint-disable-next-line
    }, [visible]);

    const onTagsChange = (tags) => {
        setQuestion({
            ...question,
            tags: tags
        })
    }

    const onQuestionChange = (e) => {
        setError(noError)
        setQuestion({
            ...question,
            question: e.target.value
        })
    }

    const onDifficultyChange = (e) => {
        setQuestion({
            ...question,
            difficulty: e.target.value
        })
    }

    const onCreateClicked = () => {
        if (!question.question || question.question.length === 0) {
            setError({
                status: 'error',
                help: 'Question field is required.',
            })
        } else {
            onCreate(question)
        }
    }

    const onRemoveClicked = () => {
        setError(noError)
        onRemove(questionToUpdate)
    }

    const onCancelClicked = () => {
        setError(noError)
        onCancel()
    }

    return (
        <Drawer
            key={questionId}
            title={questionToUpdate ? "Update question" : "Add question"}
            width={500}
            closable={true}
            destroyOnClose={true}
            visible={visible}
            onClose={onCancel}
            footer={[
                <div className={styles.footer}>
                    <>{questionToUpdate && <Button key="remove" danger onClick={onRemoveClicked}>Remove</Button>}</>
                    <div className={styles.space} />
                    <Space>
                        <Button onClick={onCancelClicked}>Cancel</Button>
                        <Button type="primary" onClick={onCreateClicked}>Save</Button>
                    </Space>
                </div>
            ]}
        >
            <Form {...layout}>
                <Form.Item label="Question" validateStatus={error.status} help={error.help}>
                    <Input.TextArea defaultValue={question.question} onChange={onQuestionChange} />
                </Form.Item>
                <Form.Item label="Tags">
                    <Select mode="tags"
                            style={{ width: '100%' }}
                            onChange={onTagsChange}
                            defaultValue={defaultTo(question.tags, [])}
                            options={tags}
                    />
                </Form.Item>
                <Form.Item label="Difficulty">
                    <Radio.Group
                        options={difficultOptions}
                        onChange={onDifficultyChange}
                        defaultValue={defaultTo(question.difficulty, Difficulty.EASY)}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
            </Form>
        </Drawer>
    );
}

export default QuestionDetailsModal
