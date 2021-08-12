import Layout from "../../components/layout/layout";
import { Button, Card, Col, Form, Input, message, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import styles from "../team-new/team-new.module.css";
import { createTeam } from "../../store/teams/actions";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { STATUS_ERROR, STATUS_FINISHED, STATUS_STARTED } from "../../store/common";
import { useHistory } from "react-router-dom";
import { routeTeamSettings } from "../../components/utils/route";

/**
 *
 * @param {String} createTeamStatus
 * @param {Team} createTeamResult
 * @param createTeam
 * @returns {JSX.Element}
 * @constructor
 */
const NewTeam = ({ createTeamStatus, createTeamResult, createTeam }) => {

    const [createStatus, setCreateStatus] = useState();

    const history = useHistory();

    useEffect(() => {
        const newStatus = createTeamStatus;
        const prevStatus = createStatus;

        if (prevStatus === STATUS_STARTED && newStatus === STATUS_FINISHED && createTeamResult) {
            message.success("Team has been create.")
            history.push(routeTeamSettings(createTeamResult.teamId))
        } else if (prevStatus === STATUS_STARTED && newStatus === STATUS_ERROR) {
            message.error("Team creation failed.")
        }
        setCreateStatus(newStatus)

        // eslint-disable-next-line
    }, [createTeamStatus]);

    const team = {
        teamName: ''
    }

    const onNameChange = (e) => {
        team.teamName = e.target.value;
    };

    const onSaveClicked = () => {
        createTeam(team)
    };

    return (
        <Layout>
            <Col span={24} xl={{ span: 12, offset: 6 }} xxl={{ span: 12, offset: 6 }}>
                <Spin spinning={createStatus === STATUS_STARTED} tip="Creating team...">
                    <Card style={{ marginTop: 12 }}>
                        <Title level={4}>Create Team</Title>
                        <Text type="secondary" style={{ marginTop: 12 }}>
                            Share templates and interviews with your team.
                        </Text>
                        <Form
                            style={{ marginTop: 24 }}
                            name="basic"
                            layout="vertical"
                            onFinish={onSaveClicked}
                        >
                            <Form.Item
                                name="name"
                                label={<Text strong>Name</Text>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter team name",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Team name"
                                    onChange={onNameChange}
                                />
                            </Form.Item>
                            <div className={styles.divRight}>

                                <Button type="primary" htmlType="submit">
                                    Create team
                                </Button>

                            </div>
                        </Form>
                    </Card>
                </Spin>
            </Col>
        </Layout>
    );
}

const mapDispatch = { createTeam };

const mapState = (state) => {
    const teamState = state.team || {};

    return {
        createTeamStatus: teamState.createTeamStatus,
        createTeamResult: teamState.createTeamResult,
    };
};

export default connect(mapState, mapDispatch)(NewTeam)