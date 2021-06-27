import styles from "./account.module.css";
import Layout from "../../components/layout/layout";
import { Button, Card, Col, Divider, Row, Space, Switch } from "antd";
import React from "react";
import { ProfileIcon } from "../../components/utils/icons";
import Avatar from "antd/es/avatar/avatar";
import { useAuth0 } from "../../react-auth0-spa";
import Meta from "antd/lib/card/Meta";
import StickyHeader from "../../components/layout/header-sticky";
import Text from "antd/lib/typography/Text";
import { isStickyNotesEnabled, setStickyNotesEnabled } from "../../components/utils/storage";
import Title from "antd/lib/typography/Title";

const Account = () => {

    const { logout, user } = useAuth0();

    const getUserName = () => {
        if (user && user.name) {
            return user.name;
        }
        return 'Profile'
    }

    const getUserEmail = () => {
        if (user && user.email) {
            return user.email;
        }
        return ''
    }

    const onSignOutClicked = () => {
        logout({ returnTo: window.location.origin })
    }

    const onStickyNotesChange = (checked) => {
        setStickyNotesEnabled(checked)
    }

    return (
        <Layout pageHeader={
            <StickyHeader title="Profile" />
        } contentStyle={styles.pageContent}>
            <Row>
                <Col
                    xxl={{ span: 16, offset: 4 }}
                    xl={{ span: 20, offset: 2 }}
                    lg={{ span: 24 }}>
                    <Card>
                        <Meta
                            avatar={
                                <Avatar
                                    src={user ? user.picture : null}
                                    size={48}
                                    icon={<ProfileIcon />} />
                            }
                            title={getUserName()}
                            description={getUserEmail()}
                        />
                        <Button className={styles.button} onClick={onSignOutClicked}>Sign out</Button>
                        <Divider />
                        <div className={styles.container}>
                            <Title level={4}>Settings</Title>
                            <Space>
                                <Text>Sticky notes enabled</Text>
                                <Switch defaultChecked={isStickyNotesEnabled()} onChange={onStickyNotesChange} />
                            </Space>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Layout>
    )
}
export default Account;