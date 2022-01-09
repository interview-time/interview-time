import { Button, Input, Space, Table, Tag } from "antd";
import Text from "antd/lib/typography/Text";
import styles from "./team-settings.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Role",
        key: "role",
        render: (member) => member.roles.map((role) => <Tag>{role}</Tag>),
    },
];

/**
 *
 * @param {String} token
 * @param {String} userName
 * @param {String} teamName
 * @param {TeamMember[]} teamMembers
 * @returns {JSX.Element}
 * @constructor
 */
const TeamMembers = ({ token, userName, teamName, teamMembers }) => {
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
        setCopied(true);
    };

    const getSharedURL = () =>
        token
            ? encodeURI(
                  `https://app.interviewer.space/team/join/${token}?userName=${userName}&teamName=${teamName}`
              )
            : null;

    const copyButton = (
        <CopyToClipboard text={getSharedURL()} onCopy={onCopyClicked}>
            <Button type="text" size="small" icon={copied ? <CheckOutlined /> : null}>
                {copied ? "Copied" : "Copy"}
            </Button>
        </CopyToClipboard>
    );

    return (
        <div style={{ marginTop: 12 }}>
            <Table
                style={{ marginTop: 12 }}
                columns={columns}
                dataSource={teamMembers}
                scroll={{
                    x: "max-content",
                }}
                pagination={false}
            />

            <Space direction="vertical" style={{ marginTop: 24 }}>
                <Text strong>Invite anyone, with one simple link</Text>

                <Text type="secondary">
                    Anyone with the link can join your team on interviewer.space
                </Text>
            </Space>
            <Input className={styles.urlInput} addonAfter={copyButton} value={getSharedURL()} />
        </div>
    );
};

export default TeamMembers;
