import { Button, Input, Space } from "antd";
import Text from "antd/lib/typography/Text";
import styles from "./team-settings.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const TeamMembers = ({ token, userName, teamName }) => {

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

    const onCopyClicked = () => {
        setCopied(true)
    }

    const getSharedURL = () => token ? `https://app.interviewer.space/team/join/${token}?userName=${userName}&teamName=${teamName}` : null

    const copyButton = <CopyToClipboard text={getSharedURL()} onCopy={onCopyClicked}>
        <Button type="text"
                size="small"
                icon={copied ? <CheckOutlined /> : null}>
            {copied ? "Copied" : "Copy"}
        </Button>
    </CopyToClipboard>

    return <div style={{ marginTop: 24 }}>
        <Space direction="vertical">
            <Text strong>Invite anyone, with one simple link</Text>

            <Text type="secondary">
                Anyone with the link can join your team on interviewer.space
            </Text>
        </Space>
        <Input className={styles.urlInput}
               addonAfter={copyButton}
               value={getSharedURL()} />
    </div>
}

export default TeamMembers