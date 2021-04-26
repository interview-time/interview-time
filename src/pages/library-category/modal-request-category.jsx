import { Input, message, Modal, Space } from "antd";
import React, { useState } from "react";
import Text from "antd/es/typography/Text";
import TextArea from "antd/lib/input/TextArea";
import { sendCategoryRequest } from "../../components/utils/feedback";
import { useAuth0 } from "../../react-auth0-spa";

const RequestCategoryModal = ({ visible, onCancel }) => {

    const { user } = useAuth0();
    const [request, setRequest] = useState({});
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const onCategoryChange = (e) => {
        setRequest({
            ...request,
            category: e.target.value
        })
    }

    const onDetailsChange = (e) => {
        setRequest({
            ...request,
            details: e.target.value
        })
    }

    const getUserEmail = () => {
        if (user && user.email) {
            return user.email;
        }
        return 'unknown@email.com'
    }

    const onSendClicked = () => {
        if (request.category.length !== 0) {
            setConfirmLoading(true)
            sendCategoryRequest(getUserEmail(), request.category, request.details, () => {
                setConfirmLoading(false)
                onCancel()
                message.success("Thank you for your request");
            })
        }
    }

    const onCancelClicked = () => {
        onCancel()
    }

    return (
        <Modal destroyOnClose={true} title={"Category Request"}
               visible={visible} closable={false}
               okText={"Send request"}
               cancelText="Cancel"
               confirmLoading={confirmLoading}
               onOk={onSendClicked}
               onCancel={onCancelClicked}>

            <Space direction="vertical" style={{ width: "100%" }}>
                <Text strong>Missing Category?</Text>
                <Text>Tell us about the category you need, and we will add it.</Text>
            </Space>
            <Space direction="vertical" style={{ width: "100%", marginTop: 24 }}>
                <Text>Category</Text>
                <Input placeholder='Type category you need...'
                       onChange={onCategoryChange}
                />
            </Space>
            <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
                <Text>Details</Text>
                <TextArea
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    placeholder="Add some details..." onChange={onDetailsChange} />
            </Space>

        </Modal>
    );
}

export default RequestCategoryModal