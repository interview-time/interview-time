import styles from "./account.module.css";
import Layout from "../../components/layout/layout";
import { Button, Card, PageHeader } from "antd";
import React from "react";
import { ProfileIcon } from "../../components/utils/icons";
import Avatar from "antd/es/avatar/avatar";
import { useAuth0 } from "../../react-auth0-spa";
import Meta from "antd/lib/card/Meta";

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

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Profile"
        >
        </PageHeader>}>

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
            </Card>

        </Layout>
    )
}
export default Account;