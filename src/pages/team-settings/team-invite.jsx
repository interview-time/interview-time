import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Input, Select } from "antd";
import Text from "antd/lib/typography/Text";
import { CheckIcon, MailIcon } from "../../components/utils/icons";
import { Option } from "antd/lib/mentions";
import { inviteUser } from "../../store/user/actions";
import styles from "./team-settings.module.css";

/**
 *
 * @param {String} token
 * @param {String} userName
 * @param {String} teamName
 * @param {TeamMember[]} teamMembers
 * @returns {JSX.Element}
 * @constructor
 */
const TeamInvite = ({ inviteUser }) => {
    const ROLE_INTERVIEWER = "INTERVIEWER";
    const ROLE_HIRING_MANAGER = "HIRING_MANAGER";
    const ROLE_HR = "HR";

    const [sent, setSent] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(ROLE_INTERVIEWER);

    useEffect(() => {
        let timeoutId;

        if (sent) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                setSent(false);
                setEmail("");
                setRole(ROLE_INTERVIEWER);
            }, 1000);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [sent]);

    return (
        <div>
            <Text type='secondary'>Invite interviewers, hiring managers or recruiters to your team</Text>
            <div className={styles.divRight}>
                <Input
                    style={{ marginRight: 12 }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Email address'
                />
                <Select
                    defaultValue={ROLE_INTERVIEWER}
                    value={role}
                    style={{ minWidth: 180, marginRight: 12 }}
                    onChange={value => setRole(value)}
                >
                    <Option value={ROLE_INTERVIEWER}>Interviewer</Option>
                    <Option value={ROLE_HIRING_MANAGER}>Hiring Manager</Option>
                    <Option value={ROLE_HR}>Recruiter</Option>
                </Select>

                <Button
                    icon={sent ? <CheckIcon /> : <MailIcon />}
                    type='primary'
                    onClick={() => {
                        inviteUser(email, role);
                        setSent(true);
                    }}
                >
                    {sent ? "Sent!" : "Send Invite"}
                </Button>
            </div>
        </div>
    );
};

export default connect(null, { inviteUser })(TeamInvite);
