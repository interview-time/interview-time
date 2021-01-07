import styles from "./account.module.css";
import Layout from "../../components/layout/layout";
import {Button, Card, Col, PageHeader, Row} from "antd";
import React from "react";
import {useAuth0} from "../../react-auth0-spa";

const Account = () => {

    const { logout } = useAuth0();

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Account  Details"
        >
        </PageHeader>}>

            <Row gutter={16} justify="center">
                <Col className={styles.detailsCard}>
                    <Card title="Kristin Watson" bordered={false} headStyle={{textAlign: 'center'}}>
                        <Button type="primary" onClick={() => logout()}>Logout</Button>
                    </Card>
                </Col>
            </Row>

        </Layout>
    )
}
export default Account;