import React, { useState, useEffect } from "react";
import { CheckIcon, CopyIcon } from "../../components/utils/icons";
import { Button, Input, Modal } from "antd";
import Text from "antd/lib/typography/Text";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styles from "./interview-scorecard.module.css";

const ShareScorecard = ({ visible, onClose, token }) => {
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

    const getSharedURL = () =>
        token
            ? encodeURI(
                  `https://app.interviewer.space/public/scorecard/${token}`
              )
            : null;

    return (
        <Modal
            destroyOnClose={true}
            title={"Share your scorecard"}
            visible={visible}
            closable={true}
            footer={null}
            width={600}
            bodyStyle={{ padding: 0 }}
            onCancel={() => onClose()}
        >
            <div>
                <Text type='secondary'>Anyone with with the link can view the scorecard</Text>
                <div>
                    <Input style={{ marginRight: 12 }} value={getSharedURL()} />

                    <CopyToClipboard text={getSharedURL()} onCopy={() => setCopied(true)}>
                        <Button icon={copied ? <CheckIcon /> : <CopyIcon />} type='primary'>
                            {copied ? "Copied" : "Copy link"}
                        </Button>
                    </CopyToClipboard>
                </div>
            </div>
        </Modal>
    );
};

export default ShareScorecard;
