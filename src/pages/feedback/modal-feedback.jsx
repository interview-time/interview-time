import { message, Modal } from "antd";
import React, { useState } from "react";
import Text from "antd/es/typography/Text";
import TextArea from "antd/lib/input/TextArea";
import { sendFeedback } from "../../components/utils/feedback";
import { useAuth0 } from "../../react-auth0-spa";

const FeedbackModal = ({ visible, onClose }) => {

    const { user } = useAuth0();
    const [feedback, setFeedback] = useState(null);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const onFeedbackChange = (e) => {
        setFeedback(e.target.value)
    }

    const getUserName = () => {
        if (user && user.name) {
            return user.name;
        }
        return 'Unknown User'
    }

    const getUserEmail = () => {
        if (user && user.email) {
            return user.email;
        }
        return 'unknown@email.com'
    }

    const onSendClicked = () => {
        if (feedback.length !== 0) {
            setConfirmLoading(true)
            sendFeedback(getUserName(), getUserEmail(), feedback, () => {
                setConfirmLoading(false)
                onClose()
                message.success("Thank you for your feedback");
            })
        }
    }

    const onCancelClicked = () => {
        onClose()
    }

    return (
        <Modal destroyOnClose={true} title={"Feedback"}
               visible={visible} closable={false}
               okText={"Send feedback"}
               cancelText="Cancel"
               confirmLoading={confirmLoading}
               onOk={onSendClicked}
               onCancel={onCancelClicked}>
            <Text>Your feedback</Text>
            <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ marginTop: 16 }}
                placeholder="Describe your issue or share your ideas..." onChange={onFeedbackChange} />
        </Modal>
    );
}

export default FeedbackModal