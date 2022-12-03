import React from "react";
import { Col, Row } from "antd";
import Layout from "../../components/layout/layout";
import CreateCandidate from "../candidate-profile/create-candidate";
import { routeCandidates } from "../../utils/route";
import { useHistory } from "react-router-dom";
import styles from "./candidate-add.module.css";

const CandidateAdd = () => {
    const history = useHistory();

    return (
        // @ts-ignore
        <Layout contentStyle={styles.rootContainer}>
            <Row gutter={[32, 32]}>
                <Col span={24} lg={{ span: 20, offset: 2 }} xl={{ span: 16, offset: 4 }} xxl={{ span: 12, offset: 6 }}>
                    <CreateCandidate
                        // @ts-ignore
                        onSave={() => history.push(routeCandidates())}
                        onCancel={() => history.push(routeCandidates())}
                    />
                </Col>
            </Row>
        </Layout>
    );
};

export default CandidateAdd;
