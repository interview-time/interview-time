import styles from "./template-share-modal.module.css";
import { Button, Input, Modal, Space, Switch } from "antd";
import Text from "antd/es/typography/Text";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckOutlined } from "@ant-design/icons";

/**
 *
 * @param {boolean} loading
 * @param {boolean} visible
 * @param {boolean} shared
 * @param {string} token
 * @param onShareChange
 * @param onClose
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateShareModal = ({ visible, shared, token, onShareChange, onClose }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let timeoutId;

        if (copied) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                setCopied(false);
            }, 1000);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [copied]);

    const onCancelClicked = () => {
        onClose();
    };

    const onCopyClicked = () => {
        setCopied(true);
    };

    const getSharedURL = () => (token ? `https://app.interviewtime.io/template/shared/${token}` : null);

    const copyButton = (
        <CopyToClipboard text={getSharedURL()} onCopy={onCopyClicked}>
            <Button type='text' size='small' icon={copied ? <CheckOutlined /> : null}>
                {copied ? "Copied" : "Copy"}
            </Button>
        </CopyToClipboard>
    );

    return (
        <Modal
            destroyOnClose={true}
            title={"Template Sharing"}
            closable={true}
            okText={"Send feedback"}
            cancelText='Cancel'
            visible={visible}
            footer={null}
            onCancel={onCancelClicked}
        >
            <div className={styles.divSpaceBetween}>
                <Space direction='vertical'>
                    <Text strong>Share to web</Text>
                    <Text type='secondary'>Anyone with the link can view and use.</Text>
                </Space>
                <Switch onChange={onShareChange} defaultChecked={shared} />
            </div>

            {shared && token && <Input className={styles.urlInput} addonAfter={copyButton} value={getSharedURL()} />}
        </Modal>
    );
};

export default TemplateShareModal;
