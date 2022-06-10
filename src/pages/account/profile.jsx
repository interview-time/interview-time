import React from "react";
import styles from "./profile.module.css";
import { ProfileIcon } from "../../components/utils/icons";
import Avatar from "antd/es/avatar/avatar";
import { useAuth0 } from "../../react-auth0-spa";
import Card from "../../components/card/card";
import { connect } from "react-redux";
import AccountLayout from "./account-layout";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { Button, Col, Form, Input, message, Row, Space } from "antd";
import { updateProfile } from "../../store/user/actions";

/**
 *
 * @param {UserProfile} profile
 * @param updateProfile
 * @returns {JSX.Element}
 * @constructor
 */
const Profile = ({ profile, updateProfile }) => {
    const { user } = useAuth0();
    const { logout } = useAuth0();

    const onSignOutClicked = () => {
        logout({ returnTo: window.location.origin });
    };

    const onSaveClicked = values => {
        updateProfile({
            ...profile,
            name: values.name,
            position: values.position,
        });
        message.success("Profile updated");
    };

    return (
        <AccountLayout>
            <Card>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Profile
                </Title>

                <Row>
                    <Col span={12}>
                        <Form
                            name='basic'
                            layout='vertical'
                            onFinish={onSaveClicked}
                            initialValues={{
                                name: profile.name,
                                email: profile.email,
                            }}
                        >
                            <Form.Item name='name' label={<Text strong>Full name</Text>}>
                                <Input placeholder='Jon Doe' />
                            </Form.Item>

                            <Form.Item name='position' label={<Text strong>Position</Text>}>
                                <Input placeholder='Engineering Manager' />
                            </Form.Item>

                            <Form.Item name='email' label={<Text strong>Email</Text>}>
                                <Input placeholder='Email' disabled={true} />
                            </Form.Item>

                            <Space>
                                <Button type='primary' htmlType='submit'>
                                    Update
                                </Button>
                                <Button onClick={onSignOutClicked}>Sign out</Button>
                            </Space>
                        </Form>
                    </Col>
                    <Col span={12}>
                        <div className={styles.avatarContainer}>
                            <Avatar src={user ? user.picture : null} size={96} icon={<ProfileIcon />} />
                        </div>
                    </Col>
                </Row>
            </Card>
        </AccountLayout>
    );
};

const mapDispatch = { updateProfile };

const mapState = state => {
    const userState = state.user || {};

    return {
        profile: userState.profile,
    };
};

export default connect(mapState, mapDispatch)(Profile);
