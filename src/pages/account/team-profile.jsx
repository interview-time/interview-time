import React from "react";
import Card from "../../components/card/card";
import { connect } from "react-redux";
import AccountLayout from "./account-layout";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { Button, Form, Input, message, Popconfirm, Space } from "antd";
import { deleteTeam, leaveTeam, updateTeam } from "../../store/user/actions";
import { selectActiveTeam } from "../../store/user/selector";
import { isTeamAdmin } from "../../store/user/permissions";
import { useHistory } from "react-router-dom";

/**
 *
 * @param {Team} team
 * @param updateTeam
 * @param leaveTeam
 * @param deleteTeam
 * @returns {JSX.Element}
 * @constructor
 */
const TeamProfile = ({ team, updateTeam, leaveTeam, deleteTeam }) => {
    const history = useHistory();
    const isAdmin = isTeamAdmin(team);

    const onDeleteClicked = () => {
        deleteTeam(team.teamId);
        message.success(`Team '${team.teamName}' has been removed.`);
        history.push("/");
    };

    const onSaveClicked = values => {
        const newTeam = {
            ...team,
            teamName: values.teamName,
        };
        updateTeam(newTeam);
        message.success(`Team name changed to '${newTeam.teamName}'.`);
    };

    const onLeaveClicked = () => {
        leaveTeam(team.teamId);
        message.success(`You left '${team.teamName}' team.`);
        history.push("/");
    };

    return (
        <AccountLayout>
            <Card>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Company profile
                </Title>

                <Form
                    name='basic'
                    layout='vertical'
                    onFinish={onSaveClicked}
                    initialValues={{
                        teamName: team.teamName,
                    }}
                >
                    <Form.Item
                        name='teamName'
                        label={<Text strong>Company name</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter company name",
                            },
                        ]}
                    >
                        <Input placeholder='Team name' disabled={!isAdmin} />
                    </Form.Item>
                    <div>
                        <Space>
                            <Button type='primary' htmlType='submit' disabled={!isAdmin}>
                                Update
                            </Button>
                            <Popconfirm
                                title='Are you want to delete this team?'
                                onConfirm={onDeleteClicked}
                                okText='Yes'
                                cancelText='No'
                                disabled={!isAdmin}
                            >
                                <Button disabled={!isAdmin}>Delete</Button>
                            </Popconfirm>
                            {!isAdmin && (
                                <Popconfirm
                                    title='Are you want to leave this team?'
                                    onConfirm={onLeaveClicked}
                                    okText='Yes'
                                    cancelText='No'
                                >
                                    <Button>Leave</Button>
                                </Popconfirm>
                            )}
                        </Space>
                    </div>
                </Form>
            </Card>
        </AccountLayout>
    );
};

const mapDispatch = { updateTeam, leaveTeam, deleteTeam };

const mapState = state => {
    const userState = state.user || {};

    return {
        team: selectActiveTeam(userState.profile),
    };
};

export default connect(mapState, mapDispatch)(TeamProfile);
