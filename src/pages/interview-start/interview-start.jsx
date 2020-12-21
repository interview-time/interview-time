import React, {useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Button, PageHeader} from 'antd';
import Layout from "../../components/layout/layout";
import styles from "./interview-start.module.css";
import InterviewDetailsCard from "../../components/interview/interview-details-card";

const InterviewStart = () => {
    const {id} = useParams();

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Interview - Jon Doe"
            onBack={() => window.history.back()}
            extra={[
                <Button type="default">
                    <Link to={`/interviews/details/${id}`}>
                        <span className="nav-text">Edit</span>
                    </Link>
                </Button>,
                <Button type="primary">
                    <Link to={`/interviews`}>
                        <span className="nav-text">Start</span>
                    </Link>
                </Button>,
            ]}
        >
        </PageHeader>}>
            <InterviewDetailsCard />
        </Layout>
    )
}

export default InterviewStart;