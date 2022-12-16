import React from "react";
import { Col, Row, Typography } from "antd";
import Layout from "../../components/layout/layout";
import CreateCandidate from "../candidate-profile/create-candidate";
import { routeCandidates } from "../../utils/route";
import { useHistory } from "react-router-dom";
import Card from "../../components/card/card";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Title } = Typography;

const Header = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
`;

const CandidateAdd = () => {
    const history = useHistory();

    return (
        // @ts-ignore
        <Layout >
            <Row>
                <Col span={24} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>
                    <Card>
                        <Header onClick={() => history.goBack()}>
                            <ArrowLeftOutlined />
                            <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                                Add Candidate
                            </Title>
                        </Header>
                        <CreateCandidate
                            // @ts-ignore
                            onSave={() => history.push(routeCandidates())}
                            onCancel={() => history.push(routeCandidates())}
                        />
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default CandidateAdd;
