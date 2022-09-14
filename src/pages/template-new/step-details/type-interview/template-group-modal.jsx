import Modal from "antd/lib/modal/Modal";
import styles from "./template-group-modal.module.css";
import { Button, Input, Space } from "antd";
import Text from "antd/lib/typography/Text";
import * as React from "react";

const TemplateGroupModal = ({ visible, name, id, onAdd, onUpdate, onCancel }) => {
    const [groupName, setGroupName] = React.useState();

    const onCancelClicked = () => {
        onCancel();
    };

    const onAddClicked = () => {
        onAdd(groupName);
    };

    const onUpdateClicked = () => {
        onUpdate(id, groupName);
    };

    const onChange = e => {
        setGroupName(e.target.value);
    };

    return (
        <Modal
            title={"Add Question Group"}
            visible={visible}
            closable={false}
            destroyOnClose={true}
            onClose={onCancelClicked}
            footer={[
                <div className={styles.modalFooter}>
                    <Space>
                        <Button onClick={onCancelClicked}>Cancel</Button>
                        {!id && (
                            <Button type='primary' onClick={onAddClicked}>
                                Add
                            </Button>
                        )}
                        {id && (
                            <Button type='primary' onClick={onUpdateClicked}>
                                Update
                            </Button>
                        )}
                    </Space>
                </div>,
            ]}
        >
            <Text strong>Group Name</Text>
            <Input
                style={{ marginTop: "8px" }}
                placeholder='e.g Problem Solving'
                onChange={onChange}
                defaultValue={name}
            />
        </Modal>
    );
};

export default TemplateGroupModal;
