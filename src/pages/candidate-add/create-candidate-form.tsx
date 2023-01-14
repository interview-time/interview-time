import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FormLabel, SecondaryText } from "../../assets/styles/global-styles";
import { Button, Form, Input, message, Select, Space, Typography, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { getAccessTokenSilently } from "../../react-auth0-spa";
import { config } from "../../store/common";
import { log } from "../../utils/log";
import { cloneDeep } from "lodash";
import { Candidate, Job, JobStatus, UserProfile } from "../../store/models";
import { ApiRequestStatus } from "../../store/state-models";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { ChevronDown, ChevronUp } from "lucide-react";
import styled from "styled-components";
import { selectUserProfile } from "../../store/user/selector";
import { selectCreateCandidateStatus, selectUpdateCandidateStatus } from "../../store/candidates/selector";
import { createCandidate, updateCandidate } from "../../store/candidates/actions";
import { selectJobs } from "../../store/jobs/selectors";
import { fetchJobs } from "../../store/jobs/actions";

const { Text } = Typography;
const { Dragger } = Upload;

const MoreFieldsButton = styled(Button)`
    padding-left: 0;
`;

const CandidateDetailsForm = styled(Form)`
    margin-top: 24px;
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

type Props = {
    candidate?: Candidate;
    jobId?: string;
    stageId?: string;
    onSave: (candidateId: string) => void;
    onCancel: () => void;
};

const CreateCandidateForm = ({ candidate, jobId, stageId, onSave, onCancel }: Props) => {
    const dispatch = useDispatch();

    const [moreFieldsVisible, setMoreFieldsVisible] = useState(false);
    const [candidateId] = useState<string>(candidate?.candidateId ?? uuidv4());
    const [resumeFile, setResumeFile] = useState<string | null>(candidate?.resumeUrl ?? null);

    const userProfile: UserProfile = useSelector(selectUserProfile, shallowEqual);
    const createCandidateStatus = useSelector(selectCreateCandidateStatus, shallowEqual);
    const updateCandidateStatus = useSelector(selectUpdateCandidateStatus, shallowEqual);
    const jobs: Job[] = useSelector(selectJobs, shallowEqual);

    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchJobs());
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (
            createCandidateStatus.status === ApiRequestStatus.Success ||
            updateCandidateStatus.status === ApiRequestStatus.Success
        ) {
            onSave(candidateId);
            form.resetFields();
            setResumeFile(null);
        }
        // eslint-disable-next-line
    }, [updateCandidateStatus, createCandidateStatus]);

    useEffect(() => {
        form.resetFields();

        // eslint-disable-next-line
    }, [candidate]);

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

        const url = `${process.env.REACT_APP_API_URL}/candidate/upload-signed-url/${userProfile.currentTeamId}/${candidateId}/${filename}`;

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

    const jobsOptions = jobs
        .filter(job => job.status === JobStatus.OPEN)
        .map(job => ({
            label: job.title,
            value: job.jobId,
        }));

    const onFinish = (values: any) => {
        if (candidate) {
            const updatedCandidate: Candidate = cloneDeep(candidate);
            updatedCandidate.candidateName = values.candidateName;
            updatedCandidate.position = values.position;
            updatedCandidate.phone = values.phone;
            updatedCandidate.location = values.location;
            updatedCandidate.email = values.email;
            updatedCandidate.linkedIn = values.linkedIn;
            updatedCandidate.gitHub = values.gitHub;
            updatedCandidate.jobId = jobId ?? values.jobId;
            updatedCandidate.stageId = stageId;

            if (resumeFile) {
                updatedCandidate.resumeFile = resumeFile;
            }
            dispatch(updateCandidate(updatedCandidate));
        } else {
            dispatch(
                createCandidate({
                    ...values,
                    candidateId: candidateId,
                    resumeFile: resumeFile,
                    jobId: jobId ?? values.jobId,
                    stageId: stageId,
                })
            );
        }
    };

    const createDragger = () => (
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
    );

    return (
        <>
            <CandidateDetailsForm
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
                    jobId: jobId ?? candidate?.jobId,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name='candidateName'
                    label={<FormLabel>Name</FormLabel>}
                    rules={[
                        {
                            required: true,
                            message: "Please enter candidate's name",
                        },
                    ]}
                >
                    <Input placeholder="Candidate's full name" />
                </Form.Item>

                {!jobId && candidate && candidate.jobId && (
                    <Form.Item name='jobId' label={<FormLabel>Job</FormLabel>}>
                        <Select disabled={true} allowClear={true} placeholder='Job' options={jobsOptions} />
                    </Form.Item>
                )}

                <Form.Item name='email' label={<FormLabel>Email</FormLabel>}>
                    <Input placeholder="Candidate's email" />
                </Form.Item>

                <Form.Item name='phone' label={<FormLabel>Phone</FormLabel>}>
                    <Input placeholder="Candidate's phone" />
                </Form.Item>

                <Form.Item name='location' label={<FormLabel>Location</FormLabel>}>
                    <Input placeholder="Candidate's location" />
                </Form.Item>

                {moreFieldsVisible && (
                    <>
                        <Form.Item name='linkedIn' label={<FormLabel>LinkedIn</FormLabel>}>
                            <Input placeholder="Candidate's LinkedIn page" />
                        </Form.Item>

                        <Form.Item name='gitHub' label={<FormLabel>GitHub</FormLabel>}>
                            <Input placeholder="Candidate's GitHub account" />
                        </Form.Item>

                        <Form.Item name='file' label={<FormLabel>Resume</FormLabel>}>
                            {createDragger()}
                        </Form.Item>
                    </>
                )}

                <MoreFieldsButton type='link' onClick={() => setMoreFieldsVisible(!moreFieldsVisible)}>
                    {moreFieldsVisible ? "Hide" : "Show"} more fields
                    <AntIconSpan>
                        {moreFieldsVisible ? <ChevronUp size='1em' /> : <ChevronDown size='1em' />}
                    </AntIconSpan>
                </MoreFieldsButton>

                <Footer>
                    <Space size={8}>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={
                                createCandidateStatus.status === ApiRequestStatus.InProgress ||
                                updateCandidateStatus.status === ApiRequestStatus.InProgress
                            }
                        >
                            Save
                        </Button>
                    </Space>
                </Footer>
            </CandidateDetailsForm>
        </>
    );
};

export default CreateCandidateForm;
