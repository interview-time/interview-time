import { Button, Form, Input, Modal, Radio } from "antd";
import React, { useState } from "react";
import EditableTagGroup from "./editable-tag-group";
import lang from "lodash/lang";
import { Difficulty } from "../utils/constants";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const QuestionDetailsModal = ({ visible, onCreate, onRemove, onCancel, questionToUpdate }) => {
    const plainOptions = [
        Difficulty.EASY,
        Difficulty.MEDIUM,
        Difficulty.HARD,
    ];

    const noError = {
        status: '',
        help: '',
    }

    const emptyQuestion = {
        tags: [],
        question: '',
        difficulty: Difficulty.EASY,
    }

    const [question, setQuestion] = useState(emptyQuestion);
    const [error, setError] = useState(noError);

    React.useEffect(() => {
        setQuestion(questionToUpdate ? lang.cloneDeep(questionToUpdate) : emptyQuestion)
        setError(noError)
        // eslint-disable-next-line
    }, [questionToUpdate]);

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
        if(!question.question || question.question.length === 0) {
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
        <Modal destroyOnClose={true} title={question.questionId ? "Update question" : "Add question"}
               visible={visible} closable={false}
               afterClose={()=>{
                   setQuestion(emptyQuestion)
               }}
               footer={[
                   <Button onClick={onCancelClicked}>
                       Cancel
                   </Button>,
                   <>{question.questionId && <Button key="remove" danger onClick={onRemoveClicked}>
                       Remove
                   </Button>}</>,
                   <Button type="primary" onClick={onCreateClicked}>
                       {question.questionId ? "Update" : "Add"}
                   </Button>,
               ]}
        >
            <Form {...layout} preserve={false}>
                <Form.Item label="Question" validateStatus={error.status} help={error.help}>
                    <Input.TextArea defaultValue={question.question} onChange = {onQuestionChange} />
                </Form.Item>
                <Form.Item label="Difficulty">
                    <Radio.Group
                        options={plainOptions}
                        onChange={onDifficultyChange}
                        defaultValue={question.difficulty ? question.difficulty : Difficulty.EASY}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
                <Form.Item label="Tags">
                    <EditableTagGroup tags={question.tags ? question.tags : []} onChange={onTagsChange} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default QuestionDetailsModal
