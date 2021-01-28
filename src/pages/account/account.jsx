import styles from "./account.module.css";
import Layout from "../../components/layout/layout";
import { PageHeader, Result } from "antd";
import React from "react";

const Account = () => {
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
            />
        </Layout>
    )
}
export default Account;