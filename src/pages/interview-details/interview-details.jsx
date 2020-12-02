import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Button, PageHeader} from 'antd';
import Layout from "../../components/layout/layout";
import styles from "./interview-details.module.css";
import InterviewDetailsCard from "../../components/interview/interview-details-card";

const InterviewDetails = () => {

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Interview - Jon Doe"
            onBack={() => window.history.back()}
            extra={[
                <Button type="primary">
                    <Link to={`/interviews`}>
                        <span className="nav-text">Finish</span>
                    </Link>
                </Button>,
            ]}
        >
        </PageHeader>}>
            <InterviewDetailsCard />
        </Layout>
    )
}

export default InterviewDetails;