import styles from "./account.module.css";
import Layout from "../../components/layout/layout";
import { Button, PageHeader, Result } from "antd";
import React from "react";
import { useAuth0 } from "../../react-auth0-spa";

const Account = () => {

    const { logout } = useAuth0();

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Profile"
        >
        </PageHeader>}>

            <Result
                status="404"
                title="Coming soon"
                subTitle="Sorry, this page is under construction."
                extra={<Button type="primary" onClick={() => logout()}>Logout</Button>}
            />
        </Layout>
    )
}
export default Account;