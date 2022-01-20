import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Button, Card, Col, Divider, Form, Input, Row, Space, Upload, message } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { createCandidate, getUploadUrl } from "../../store/candidates/actions";
import Spinner from "../../components/spinner/spinner";
import { InboxOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config, getActiveTeamId } from "../../store/common";
import styles from "./interview-schedule.module.css";

const { Dragger } = Upload;

const CreateCandidate = ({
    candidates,
    uploadUrl,
    loading,
    createCandidate,
    getUploadUrl,
    onSave,
    onCancel,
}) => {
    const [candidateName, setCandidateName] = useState();
    const [candidateId, setCandidateId] = useState();
    const [resumeFile, setResumeFile] = useState();

    // React.useEffect(() => {
    //     const candidateIdUuid = uuidv4();
    //     const resumeFileUuid = uuidv4();

    //     setCandidateId(candidateIdUuid);
    //     setResumeFile(resumeFileUuid);

    //     //getUploadUrl(candidateIdUuid, resumeFileUuid);
    //     // eslint-disable-next-line
    // }, []);

    React.useEffect(() => {
        if (!loading && candidateName && onSave !== null) {
            onSave(candidateName);
        }
    }, [loading, candidateName, onSave]);

    const [progress, setProgress] = useState(0);

    const uploadFile = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        console.log(file);
        const candidateIdUuid = uuidv4();
        const resumeFileUuid = uuidv4();

        var re = /(?:\.([^.]+))?$/;

        var ext = re.exec(file.name)[1];

        setCandidateId(candidateIdUuid);
        setResumeFile(`resumeFileUuid${ext ? `.${ext}` : ""}`);

        const config = {
            onUploadProgress: (event) => {
                const percent = Math.floor((event.loaded / event.total) * 100);
                setProgress(percent);
                if (percent === 100) {
                    setTimeout(() => setProgress(0), 1000);
                }
                onProgress({ percent: (event.loaded / event.total) * 100 });
            },
        };

        const teamId = getActiveTeamId();
        const url = `${process.env.REACT_APP_API_URL}/upload-signed-url/${teamId}/${candidateIdUuid}/${resumeFileUuid}`;

        getAccessTokenSilently()
            .then((token) => axios.get(url, config(token)))
            .then((res) => {
                axios
                    .put(res.data, file, config)
                    .then((res) => console.log("Upload Completed", res))
                    .catch((err) => console.log("Upload Interrupted", err));
            })
            .catch((reason) => console.error(reason));
    };

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
                    createCandidate({
                        ...values,
                        candidateId: candidateId,
                        resumeFile: resumeFile,
                    });
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
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                        <Dragger
                            name="file"
                            multiple={false}
                            customRequest={uploadFile}
                            onChange={(info) => {
                                const { status } = info.file;
                                if (status !== "uploading") {
                                    console.log(info.file, info.fileList);
                                }
                                if (status === "done") {
                                    message.success(
                                        `${info.file.name} file uploaded successfully.`
                                    );
                                } else if (status === "error") {
                                    message.error(`${info.file.name} file upload failed.`);
                                }
                            }}
                            onDrop={(e) => {
                                console.log("Dropped files", e.dataTransfer.files);
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                        </Dragger>
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
    getUploadUrl,
};

const mapState = (state) => {
    const candidatesState = state.candidates || {};

    return {
        candidates: candidatesState.candidates,
        uploadUrl: candidatesState.uploadUrl,
        loading: candidatesState.loading,
    };
};

export default connect(mapState, mapDispatch)(CreateCandidate);
