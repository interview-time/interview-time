import { Button, Input, Select } from "antd";
import Text from "antd/lib/typography/Text";
import styles from "./team-settings.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "../../components/utils/icons";
import { Option } from "antd/lib/mentions";

/**
 *
 * @param {String} token
 * @param {String} userName
 * @param {String} teamName
 * @param {TeamMember[]} teamMembers
 * @returns {JSX.Element}
 * @constructor
 */
const TeamInvite = ({ token, userName, teamName }) => {

    const ROLE_INTERVIEWER = "INTERVIEWER"
    const ROLE_HIRING_MANAGER = "HIRING_MANAGER"
    const ROLE_HR = "HR"

    const [copied, setCopied] = useState(false);
    const [role, setRole] = useState(ROLE_INTERVIEWER);

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
        token ? encodeURI(`https://app.interviewer.space/team/join/${token}?userName=${userName}&teamName=${teamName}&role=${role}`) : null;

    const onRoleChanged = value => setRole(value)

    return (
        <div>
            <Text type="secondary">
                Anyone with the link can join your team
            </Text>
            <div className={styles.divRight}>
                <Input style={{ marginRight: 12 }} value={getSharedURL()} />
                <Select defaultValue={ROLE_INTERVIEWER} style={{ minWidth: 180, marginRight: 12 }}
                        onChange={onRoleChanged}>
                    <Option value={ROLE_INTERVIEWER}>Interviewer</Option>
                    <Option value={ROLE_HIRING_MANAGER}>Hiring Manager</Option>
                    <Option value={ROLE_HR}>Recruiter</Option>
                </Select>
                <CopyToClipboard text={getSharedURL()} onCopy={onCopyClicked}>
                    <Button icon={copied ? <CheckIcon /> : <CopyIcon />}
                            type="primary">
                        {copied ? "Copied" : "Copy link"}
                    </Button>
                </CopyToClipboard>
            </div>
        </div>
    )
};

export default TeamInvite;
