import { message, Modal, Typography, Input } from "antd";
import React, { useState } from "react";
import { sendFeedback } from "../../utils/feedback";
import { useAuth0 } from "../../react-auth0-spa";

const { Text } = Typography;
const { TextArea } = Input;

/**
 *
 * @param {string} title
 * @param {string} description
 * @param {boolean} visible
 * @param {function} onClose
 * @returns {JSX.Element}
 * @constructor
 */
const FeedbackModal = ({ title = "Feedback", description = "Your feedback", visible, onClose }) => {
    const { user } = useAuth0();
    const [feedback, setFeedback] = useState(null);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const onFeedbackChange = e => {
        setFeedback(e.target.value);
    };

    const getUserName = () => {
        if (user && user.name) {
            return user.name;
        }
        return "Unknown User";
    };

    const getUserEmail = () => {
        if (user && user.email) {
            return user.email;
        }
        return "unknown@email.com";
    };

    const onSendClicked = () => {
        if (feedback.length !== 0) {
            setConfirmLoading(true);
            sendFeedback(getUserName(), getUserEmail(), feedback, () => {
                setConfirmLoading(false);
                onClose();
                message.success("Your request has been sent");
            });
        }
    };

    const onCancelClicked = () => {
        onClose();
    };

    return (
        <Modal
            destroyOnClose={true}
            title={title}
            visible={visible}
            closable={false}
            okText={"Send"}
            cancelText='Cancel'
            confirmLoading={confirmLoading}
            onOk={onSendClicked}
            onCancel={onCancelClicked}
        >
            <Text>{description}</Text>
            <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ marginTop: 16 }}
                placeholder='Enter text here'
                onChange={onFeedbackChange}
            />
        </Modal>
    );
};

export default FeedbackModal;
