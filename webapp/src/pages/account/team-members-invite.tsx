import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, Select, Typography } from "antd";
import { CheckIcon, MailIcon } from "../../utils/icons";
import { Option } from "antd/lib/mentions";
import { inviteUser } from "../../store/user/actions";
import styles from "./team-members.module.css";
const { Text } = Typography;

/**
 *
 * @param {String} token
 * @returns {JSX.Element}
 * @constructor
 */

type Props = {
    inviteUser: any;
};

const TeamMembersInvite = ({ inviteUser }: Props) => {
    const ROLE_INTERVIEWER = "INTERVIEWER";
    const ROLE_HIRING_MANAGER = "HIRING_MANAGER";
    const ROLE_HR = "HR";

    const [sent, setSent] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(ROLE_INTERVIEWER);

    const [form] = Form.useForm();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;

        if (sent) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                setSent(false);
                form.resetFields();
            }, 1000);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        // eslint-disable-next-line
    }, [sent]);

    return (
        <div>
            <Text type='secondary'>Invite interviewers, hiring managers or recruiters to your team</Text>
            <Form
                form={form}
                name='invite'
                layout='horizontal'
                initialValues={{
                    email: "",
                    role: ROLE_INTERVIEWER,
                }}
                onFinish={() => {
                    inviteUser(email, role);
                    setSent(true);
                }}
                autoComplete='off'
                className={styles.inviteForm}
            >
                <Form.Item
                    name='email'
                    className={styles.inviteEmail}
                    rules={[
                        {
                            required: true,
                            message: "Please enter email address",
                        },
                        {
                            type: "email",
                            message: "Invalid email address",
                        },
                    ]}
                >
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email address' />
                </Form.Item>

                <Form.Item name='role' className={styles.inviteRole}>
                    <Select defaultValue={ROLE_INTERVIEWER} value={role} onChange={value => setRole(value)}>
                        <Option value={ROLE_INTERVIEWER}>Interviewer</Option>
                        <Option value={ROLE_HIRING_MANAGER}>Hiring Manager</Option>
                        <Option value={ROLE_HR}>Recruiter</Option>
                    </Select>
                </Form.Item>

                <Button icon={sent ? <CheckIcon /> : <MailIcon />} type='primary' htmlType='submit'>
                    {sent ? "Sent!" : "Send Invite"}
                </Button>
            </Form>
        </div>
    );
};
const mapDispatch = { inviteUser };

export default connect(null, mapDispatch)(TeamMembersInvite);
