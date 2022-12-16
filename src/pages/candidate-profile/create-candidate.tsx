import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { AutoComplete, Button, Divider, Form, Input, message, Select, Space, Upload, Typography } from "antd";
import { ApiRequest, createCandidate, updateCandidate } from "../../store/candidates/actions";
import { InboxOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../../store/common";
import styles from "../interview-schedule/interview-schedule.module.css";
import { log } from "../../utils/log";
import { cloneDeep, isEmpty, uniq } from "lodash";
import { Candidate, Interview } from "../../store/models";
import { ApiRequestStatus, IApiResults, RootState } from "../../store/state-models";
import { CandidateStatus, POSITIONS, POSITIONS_OPTIONS } from "../../utils/constants";
import { interviewsPositions } from "../../utils/filters";
import { Option } from "antd/lib/mentions";
import CandidateStatusTag from "../../components/tags/candidate-status-tag";

const { Text } = Typography;
const { Dragger } = Upload;

type Props = {
    candidate?: Candidate;
    interviews: Interview[];
    teamId?: string;
    apiResults: IApiResults;
    createCandidate: (candidate: Candidate) => any;
    updateCandidate: (candidate: Candidate) => any;
    onSave: any;
    onCancel: any;
};

const CreateCandidate = ({
    candidate,
    interviews,
    teamId,
    apiResults,
    createCandidate,
    updateCandidate,
    onSave,
    onCancel,
}: Props) => {
    const [candidateId] = useState<string | null>(candidate?.candidateId ?? uuidv4());
    const [resumeFile, setResumeFile] = useState<string | null>(candidate?.resumeUrl ?? null);
    const [positionOptions, setPositionOptions] = useState(POSITIONS_OPTIONS);

    const [form] = Form.useForm();

    useEffect(() => {
        if (
            onSave &&
            (apiResults[ApiRequest.CreateCandidate].status === ApiRequestStatus.Success ||
                apiResults[ApiRequest.UpdateCandidate].status === ApiRequestStatus.Success)
        ) {
            onSave(candidateId);
            form.resetFields();
            setResumeFile(null);
        }
        // eslint-disable-next-line
    }, [apiResults, onSave]);

    useEffect(() => {
        form.resetFields();

        // eslint-disable-next-line
    }, [candidate]);

    React.useEffect(() => {
        if (!isEmpty(interviews)) {
            const positions = interviewsPositions(interviews)
                .concat(POSITIONS)
                .map((position: string) => ({
                    value: position,
                }));

            setPositionOptions(uniq(positions));
        }
        // eslint-disable-next-line
    }, [interviews]);

    const uploadFile = async (options: any) => {
        const { onSuccess, onError, file, onProgress } = options;
        log(file);

        const resumeFileUuid = uuidv4();

        var re = /(?:\.([^.]+))?$/;

        var ext = re.exec(file.name);
        const filename = `${resumeFileUuid}${ext ? `.${ext[1]}` : ""}`;

        setResumeFile(filename);

        const axiosConfig = {
            onUploadProgress: (event: any) => {
                onProgress({ percent: (event.loaded / event.total) * 100 });
            },
        };

        const url = `${process.env.REACT_APP_API_URL}/candidate/upload-signed-url/${teamId}/${candidateId}/${filename}`;

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

    const onPositionChange = (value: string) => {
        form.setFieldsValue({ position: value });
    };

    return (
        <Form
            form={form}
            name='basic'
            layout='vertical'
            initialValues={{
                candidateName: candidate?.candidateName,
                position: candidate?.position,
                email: candidate?.email,
                phone: candidate?.phone,
                location: candidate?.location,
                linkedIn: candidate?.linkedIn,
                gitHub: candidate?.gitHub,
                status: candidate?.status,
            }}
            onFinish={values => {
                if (candidate) {
                    const updatedCandidate = cloneDeep(candidate);
                    updatedCandidate.candidateName = values.candidateName;
                    updatedCandidate.position = values.position;
                    updatedCandidate.phone = values.phone;
                    updatedCandidate.location = values.location;
                    updatedCandidate.email = values.email;
                    updatedCandidate.linkedIn = values.linkedIn;
                    updatedCandidate.gitHub = values.gitHub;
                    updatedCandidate.status = values.status;

                    if (resumeFile) {
                        updatedCandidate.resumeFile = resumeFile;
                    }
                    updateCandidate(updatedCandidate);
                    onSave();
                } else {
                    createCandidate({
                        ...values,
                        candidateId: candidateId,
                        resumeFile: resumeFile,
                    });
                }
            }}
        >
            <Form.Item
                name='candidateName'
                label={<Text strong>Candidate Name</Text>}
                rules={[
                    {
                        required: true,
                        message: "Please enter candidate's name",
                    },
                ]}
            >
                <Input className='fs-mask' placeholder="Candidate's full name" />
            </Form.Item>

            <Form.Item name='position' className={styles.formItem} label={<Text strong>Position</Text>}>
                <AutoComplete
                    allowClear
                    placeholder='Select the position you are hiring for'
                    options={positionOptions}
                    filterOption={(inputValue, option) =>
                        option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    onChange={onPositionChange}
                />
            </Form.Item>

            <Form.Item name='status' className={styles.formItem} label={<Text strong>Status</Text>}>
                <Select showArrow>
                    <Option value={CandidateStatus.NEW}>
                        <CandidateStatusTag status={CandidateStatus.NEW} />
                    </Option>
                    <Option value={CandidateStatus.INTERVIEWING}>
                        <CandidateStatusTag status={CandidateStatus.INTERVIEWING} />
                    </Option>
                    <Option value={CandidateStatus.HIRE}>
                        <CandidateStatusTag status={CandidateStatus.HIRE} />
                    </Option>
                    <Option value={CandidateStatus.NO_HIRE}>
                        <CandidateStatusTag status={CandidateStatus.NO_HIRE} />
                    </Option>
                </Select>
            </Form.Item>

            <Form.Item
                name='email'
                label={<Text strong>Email</Text>}
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Input className='fs-mask' placeholder="Candidate's email" />
            </Form.Item>

            <Form.Item
                name='phone'
                label={<Text strong>Phone</Text>}
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Input className='fs-mask' placeholder="Candidate's phone" />
            </Form.Item>

            <Form.Item
                name='location'
                label={<Text strong>Location</Text>}
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Input className='fs-mask' placeholder="Candidate's location" />
            </Form.Item>

            <Form.Item
                name='linkedIn'
                label={<Text strong>LinkedIn</Text>}
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Input placeholder="Candidate's LinkedIn page" />
            </Form.Item>

            <Form.Item
                name='gitHub'
                label={<Text strong>GitHub</Text>}
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Input placeholder="Candidate's GitHub account" />
            </Form.Item>

            {/* @ts-ignore */}
            <Dragger
                name='file'
                maxCount={1}
                style={{ display: resumeFile ? "none" : "block" }}
                multiple={false}
                listType='picture'
                customRequest={uploadFile}
                defaultFileList={
                    candidate?.resumeUrl
                        ? [
                              {
                                  uid: candidate?.candidateId ?? "1",
                                  name: "Candidate CV",
                                  status: "done",
                                  url: candidate?.resumeUrl,
                              },
                          ]
                        : []
                }
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
                <Text className='ant-upload-text' type='secondary'>
                    Click to upload or drag and drop a PDF, DOC or DOCX upto 10 MB
                </Text>
            </Dragger>

            <Divider />

            <div className={styles.divSpaceBetween}>
                <Text />
                <Space>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button
                        type='primary'
                        htmlType='submit'
                        loading={
                            apiResults[ApiRequest.CreateCandidate].status === ApiRequestStatus.InProgress ||
                            apiResults[ApiRequest.UpdateCandidate].status === ApiRequestStatus.InProgress
                        }
                    >
                        Save
                    </Button>
                </Space>
            </div>
        </Form>
    );
};

const mapDispatch = {
    createCandidate,
    updateCandidate,
};

const mapState = (state: RootState) => {
    const interviewState = state.interviews || {};
    const candidatesState = state.candidates || {};
    const userState = state.user || {};

    return {
        teamId: userState.profile?.currentTeamId,
        candidates: candidatesState.candidates,
        apiResults: candidatesState.apiResults,
        loading: candidatesState.loading,
        interviews: interviewState.interviews,
    };
};

export default connect(mapState, mapDispatch)(CreateCandidate);
