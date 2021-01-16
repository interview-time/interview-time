import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import EditableTagGroup from "./editable-tag-group";
import lang from "lodash/lang";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const QuestionDetailsModal = ({ visible, onCreate, onRemove, onCancel, questionToUpdate }) => {
    const noError = {
        status: '',
        help: '',
    }
    const [question, setQuestion] = useState({});
    const [error, setError] = useState(noError);

    React.useEffect(() => {
        setQuestion(questionToUpdate ? lang.cloneDeep(questionToUpdate) : {})
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
        <Modal destroyOnClose title={question.questionId ? "Update question" : "Add question"}
               visible={visible} closable={false}
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
                <Form.Item label="Tags">
                    <EditableTagGroup tags={question.tags ? question.tags : []} onChange={onTagsChange} />
                </Form.Item>
                <Form.Item label="Question" validateStatus={error.status} help={error.help}>
                    <Input.TextArea defaultValue={question.question} onChange = {onQuestionChange} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default QuestionDetailsModal
