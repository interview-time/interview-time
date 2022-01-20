import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Col, Divider, Form, Input, Row, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { createCandidate } from "../../store/candidates/actions";
import Spinner from "../../components/spinner/spinner";
import styles from "./interview-schedule.module.css";
import Card from "../../components/card/card";

const CreateCandidate = ({ candidates, loading, createCandidate, onSave, onCancel }) => {
    const [candidateName, setCandidateName] = useState();

    React.useEffect(() => {
        if (!loading && candidateName && onSave !== null) {            
            onSave(candidateName);
        }
    }, [loading, candidateName, onSave]);

    return loading ? (
        <Spinner />
    ) : (
        <Card style={{ marginTop: 12 }}>
            <div className={styles.header} style={{ marginBottom: 12 }}>
                <div className={styles.headerTitleContainer}>
                    <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                        Candidate Details
                    </Title>
                </div>
            </div>
            <Form
                name="basic"
                layout="vertical"
                initialValues={{
                    candidateName: "",
                    linkedin: "",
                    github: "",
                }}
                onFinish={(values) => {                    
                    createCandidate(values);
                    setCandidateName(values.candidateName);
                }}
            >
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                        <Form.Item
                            name="candidateName"
                            label={<Text strong>Candidate</Text>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter candidate's name",
                                },
                            ]}
                        >
                            <Input className="fs-mask" placeholder="Candidate's full name" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                        <Form.Item
                            name="linkedin"
                            label={<Text strong>LinkedIn</Text>}
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Input className="fs-mask" placeholder="Candidate's LinkedIn page" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                        <Form.Item
                            name="github"
                            label={<Text strong>GitHub</Text>}
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Input className="fs-mask" placeholder="Candidate's GitHub account" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <div className={styles.divSpaceBetween}>
                    <Text />
                    <Space>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Space>
                </div>
            </Form>
        </Card>
    );
};

const mapDispatch = {
    createCandidate,
};

const mapState = (state) => {
    const candidatesState = state.candidates || {};

    return {
        candidates: candidatesState.candidates,
        loading: candidatesState.loading,
    };
};

export default connect(mapState, mapDispatch)(CreateCandidate);
