import styles from "./community.module.css";
import Layout from "../../components/layout/layout";
import { PageHeader, Result } from "antd";
import React from "react";

const Community = () => {
    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Community"
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
export default Community;