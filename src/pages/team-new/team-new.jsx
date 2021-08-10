import Layout from "../../components/layout/layout";
import { Button, Card, Col, Form, Input, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import styles from "../team-new/team-new.module.css";
import { createTeam } from "../../store/teams/actions";
import { connect } from "react-redux";

/**
 *
 * @param {boolean} loading
 * @param createTeam
 * @returns {JSX.Element}
 * @constructor
 */
const NewTeam = ({ loading, createTeam }) => {

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
                <Spin spinning={loading} tip="Creating team...">
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
        loading: teamState.loading,
    };
};

export default connect(mapState, mapDispatch)(NewTeam)