import React from "react";
import styles from "./profile.module.css";
import { ProfileIcon } from "../../utils/icons";
import { useAuth0 } from "../../react-auth0-spa";
import Card from "../../components/card/card";
import { connect } from "react-redux";
import AccountLayout from "./account-layout";
import { Button, Col, Form, Input, message, Row, Select, Space, Typography, Avatar } from "antd";
import { updateProfile } from "../../store/user/actions";
import { getAllTimezones, getCurrentTimezone } from "../../utils/date-fns";
import { log } from "../../utils/log";
import { RootState } from "../../store/state-models";
import { UserProfile } from "../../store/models";

const { Title, Text } = Typography;

type Props = {
    profile?: UserProfile;
    updateProfile: any;
};
const Profile = ({ profile, updateProfile }: Props) => {
    const { user } = useAuth0();
    const { logout } = useAuth0();

    const timezoneSelector = getAllTimezones().map(item => ({
        label: item.label,
        value: item.timezone,
    }));

    const onSignOutClicked = () => {
        logout({ returnTo: window.location.origin });
    };

    const onSaveClicked = (values: any) => {
        const timezoneLabel = values.timezone ?? getCurrentTimezone().timezone;
        const timezone = getAllTimezones().find(item => item.timezone === timezoneLabel);

        log(timezone);
        updateProfile({
            ...profile,
            name: values.name,
            position: values.position,
            timezone: timezone.timezone,
            timezoneOffset: timezone.offsetMinutes,
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
                                name: profile?.name,
                                position: profile?.position,
                                email: profile?.email,
                                timezone: profile?.timezone,
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

                            <Form.Item name='timezone' label={<Text strong>Time zone</Text>}>
                                <Select
                                    showSearch
                                    placeholder='Australia/Sydney'
                                    options={timezoneSelector}
                                    filterOption={(inputValue, option) =>
                                        option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
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

const mapState = (state: RootState) => {
    const userState = state.user;

    return {
        profile: userState?.profile,
    };
};

export default connect(mapState, mapDispatch)(Profile);
