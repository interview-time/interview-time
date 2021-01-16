import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import EditableTagGroup from "./editable-tag-group";
import lang from "lodash/lang";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const QuestionDetailsModal = ({ visible, onCreate, onRemove, onCancel, questionToUpdate }) => {

    const [question, setQuestion] = useState({});

    React.useEffect(() => {
        setQuestion(questionToUpdate ? lang.cloneDeep(questionToUpdate) : {})
        // eslint-disable-next-line
    }, [questionToUpdate]);

    const onTagsChange = (tags) => {
        setQuestion({
            ...question,
            tags: tags
        })
    }

    const onQuestionChange = (e) => {
        setQuestion({
            ...question,
            question: e.target.value
        })
    }

    const onCreateClicked = () => {
        onCreate(question)
    }

    const onRemoveClicked = () => {
        onRemove(questionToUpdate)
    }

    const onCancelClicked = () => {
        onCancel()
    }

    return (
        <Modal destroyOnClose title={question.questionId ? "Update question" : "Add question"}
               visible={visible} closable={false}
               footer={[
                   <Button key="back" onClick={onCancelClicked}>
                       Cancel
                   </Button>,
                   <>{question.questionId && <Button key="remove" danger onClick={onRemoveClicked}>
                       Remove
                   </Button>}</>,
                   <Button key="submit" type="primary" onClick={onCreateClicked}>
                       {question.questionId ? "Update" : "Add"}
                   </Button>,
               ]}
        >
            <Form {...layout} preserve={false}>
                <Form.Item label="Tags">
                    <EditableTagGroup tags={question.tags ? question.tags : []} onChange={(tags) => {
                        onTagsChange(tags)
                    }} />
                </Form.Item>
                <Form.Item label="Question">
                    <Input.TextArea defaultValue={question.question} onChange = {onQuestionChange} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default QuestionDetailsModal
