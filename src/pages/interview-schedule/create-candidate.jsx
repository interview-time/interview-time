import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Button, Col, Divider, Form, Input, message, Row, Space, Upload } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { createCandidate } from "../../store/candidates/actions";
import Spinner from "../../components/spinner/spinner";
import { InboxOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config, getActiveTeamId } from "../../store/common";
import styles from "./interview-schedule.module.css";
import Card from "../../components/card/card";
import { log } from "../../components/utils/log";

const { Dragger } = Upload;

const CreateCandidate = ({ candidates, loading, createCandidate, onSave, onCancel }) => {
    const [candidateName, setCandidateName] = useState();
    const [candidateId, setCandidateId] = useState();
    const [resumeFile, setResumeFile] = useState();

    React.useEffect(() => {
        if (!loading && candidateName && onSave !== null) {
            onSave(candidateName);
        }
    }, [loading, candidateName, onSave]);

    const uploadFile = async options => {
        const { onSuccess, onError, file, onProgress } = options;
        log(file);
        const candidateIdUuid = uuidv4();
        const resumeFileUuid = uuidv4();

        var re = /(?:\.([^.]+))?$/;

        var ext = re.exec(file.name)[1];
        const filename = `${resumeFileUuid}${ext ? `.${ext}` : ""}`;

        setCandidateId(candidateIdUuid);
        setResumeFile(filename);

        const axiosConfig = {
            onUploadProgress: event => {
                onProgress({ percent: (event.loaded / event.total) * 100 });
            },
        };

        const teamId = getActiveTeamId();
        const url = `${process.env.REACT_APP_API_URL}/candidate/upload-signed-url/${teamId}/${candidateIdUuid}/${filename}`;

        getAccessTokenSilently()
            .then(token => axios.get(url, config(token)))
            .then(res => {
                axios
                    .put(res.data, file, axiosConfig)
                    .then(res => onSuccess("Ok"))
                    .catch(err => {
                        onError({ err });
                        setResumeFile(null);
                    });
            })
            .catch(reason => {
                console.error(reason);
                setResumeFile(null);
            });
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
                name='basic'
                layout='vertical'
                initialValues={{
                    candidateName: "",
                    linkedin: "",
                    github: "",
                }}
                onFinish={values => {
                    createCandidate({
                        ...values,
                        candidateId: candidateId,
                        resumeFile: resumeFile,
                    });
                    setCandidateName(values.candidateName);
                }}
            >
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Form.Item
                            name='candidateName'
                            label={<Text strong>Candidate</Text>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter candidate's name",
                                },
                            ]}
                        >
                            <Input className='fs-mask' placeholder="Candidate's full name" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Form.Item
                            name='linkedin'
                            label={<Text strong>LinkedIn</Text>}
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Input className='fs-mask' placeholder="Candidate's LinkedIn page" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Form.Item
                            name='github'
                            label={<Text strong>GitHub</Text>}
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Input className='fs-mask' placeholder="Candidate's GitHub account" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Dragger
                            name='file'
                            maxCount={1}
                            style={{ display: resumeFile ? "none" : "block" }}
                            multiple={false}
                            listType='picture'
                            customRequest={uploadFile}
                            onChange={info => {
                                const { status } = info.file;
                                if (status !== "uploading") {
                                    log(info.file, info.fileList);
                                }
                                if (status === "done") {
                                    message.success(`${info.file.name} file uploaded successfully.`);
                                } else if (status === "error") {
                                    message.error(`${info.file.name} file upload failed.`);
                                }
                            }}
                            onRemove={file => {
                                setResumeFile(null);
                            }}
                            onDrop={e => {
                                log("Dropped files", e.dataTransfer.files);
                            }}
                        >
                            <p className='ant-upload-drag-icon'>
                                <InboxOutlined />
                            </p>
                            <p className='ant-upload-text'>
                                Click to upload or drag and drop a PDF, DOC or DOCX upto 10 MB
                            </p>
                        </Dragger>
                    </Col>
                </Row>

                <Divider />

                <div className={styles.divSpaceBetween}>
                    <Text />
                    <Space>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type='primary' htmlType='submit'>
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

const mapState = state => {
    const candidatesState = state.candidates || {};

    return {
        candidates: candidatesState.candidates,
        loading: candidatesState.loading,
    };
};

export default connect(mapState, mapDispatch)(CreateCandidate);
