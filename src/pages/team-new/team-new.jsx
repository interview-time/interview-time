import Layout from "../../components/layout/layout";
import { Button, Card, Col, Form, Input, message, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import styles from "../team-new/team-new.module.css";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { routeTeamMembers } from "../../utils/route";
import { createTeam } from "../../store/user/actions";
import { defaultTo } from "lodash/util";

/**
 *
 * @param {Team[]} teams
 * @param createTeam
 * @returns {JSX.Element}
 * @constructor
 */
const NewTeam = ({ teams, createTeam }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState();

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        let team = teams.find(team => team.teamName === name);
        if (team) {
            message.success("Team has been create.");
            history.push(routeTeamMembers(team.teamId));
        }

        // eslint-disable-next-line
    }, [teams, name]);

    const hideMenu = () => {
        const params = new URLSearchParams(location.search);
        return params.get("hideMenu");
    };

    const onSaveClicked = values => {
        const teamName = values.name;

        setLoading(true);
        setName(teamName);
        createTeam({
            teamName: teamName,
        });
    };

    const Content = () => (
        <Col span={24} xl={{ span: 12, offset: 6 }} xxl={{ span: 12, offset: 6 }}>
            <Spin spinning={loading} tip='Creating team...'>
                <Card style={{ marginTop: 12 }}>
                    <Title level={4}>Create Team</Title>
                    <Text type='secondary' style={{ marginTop: 12 }}>
                        {hideMenu()
                            ? "You are not part of any team, please create a team to get started."
                            : "Share templates and interviews with your team."}
                    </Text>
                    <Form style={{ marginTop: 24 }} name='basic' layout='vertical' onFinish={onSaveClicked}>
                        <Form.Item
                            name='name'
                            label={<Text strong>Name</Text>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter team name",
                                },
                            ]}
                        >
                            <Input placeholder='Team name' />
                        </Form.Item>
                        <div className={styles.divRight}>
                            <Button type='primary' htmlType='submit'>
                                Create team
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Spin>
        </Col>
    );
    return hideMenu() ? <div className={styles.divContent}>{Content()}</div> : <Layout>{Content()}</Layout>;
};

const mapDispatch = { createTeam };

const mapState = state => {
    const userState = state.user || {};
    const profile = userState.profile || {};

    return {
        teams: defaultTo(profile.teams, []),
    };
};

export default connect(mapState, mapDispatch)(NewTeam);
