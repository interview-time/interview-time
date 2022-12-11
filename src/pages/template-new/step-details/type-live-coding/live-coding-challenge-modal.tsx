import Modal from "antd/lib/modal/Modal";
import styles from "./live-coding-challenge-modal.module.css";
import { Button, Input, Space, UploadProps, Typography, Upload } from "antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { GithubFilled } from "@ant-design/icons";
import { TemplateChallenge } from "../../../../store/models";
import { v4 as uuidv4 } from "uuid";
import UploadCircleIcon from "../../../../assets/icons/upload-circle.svg";
import { log } from "../../../../utils/log";
import { UploadFile } from "antd/lib/upload/interface";
import { uploadChallengeFile } from "../../../../store/challenge/actions";

const { Dragger } = Upload;
const { TextArea } = Input;
const { Title, Text } = Typography;

type Props = {
    visible: boolean;
    existingChallenge: Readonly<TemplateChallenge> | null;
    teamId: string;
    onAdd: (challenge: TemplateChallenge) => void;
    onUpdate: (challenge: TemplateChallenge) => void;
    onCancel: () => void;
    onDelete: (challenge: TemplateChallenge) => void;
};

const LiveCodingChallengeModal = ({
    visible,
    existingChallenge,
    teamId,
    onAdd,
    onUpdate,
    onCancel,
    onDelete,
}: Props) => {
    const newChallenge = {
        challengeId: uuidv4(),
        name: "",
        gitHubUrl: "",
    };
    const [challenge, setChallenge] = useState<TemplateChallenge>(newChallenge);
    useEffect(() => {
        if (existingChallenge) {
            setChallenge(existingChallenge);
        } else {
            setChallenge(newChallenge);
        }
        // eslint-disable-next-line
    }, [visible]);

    const onCancelClicked = () => {
        onCancel();
    };

    const onAddClicked = () => {
        onAdd(challenge);
    };

    const onUpdateClicked = () => {
        onUpdate(challenge);
    };

    const onDeleteClicked = () => {
        onDelete(challenge);
    };

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChallenge({
            ...challenge,
            name: e.target.value,
        });
    };

    const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setChallenge({
            ...challenge,
            description: e.target.value,
        });
    };

    const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChallenge({
            ...challenge,
            gitHubUrl: e.target.value,
        });
    };

    const requiredDataIsValid = () => {
        const githubUrlValid = challenge.gitHubUrl && challenge.gitHubUrl.length > 0;
        const fileNameValid = challenge.fileName && challenge.fileName.length > 0;
        return challenge.name.length !== 0 && (githubUrlValid || fileNameValid);
    };

    const defaultFileList = (): Array<UploadFile> =>
        challenge.fileName
            ? [
                  {
                      uid: challenge.challengeId,
                      name: `challenge-file-${challenge.fileName}`,
                      status: "done",
                  },
              ]
            : [];

    const uploadProps: UploadProps = {
        multiple: false,
        maxCount: 1,
        customRequest: uploadChallengeFile(teamId, challenge.challengeId),
        defaultFileList: defaultFileList(),
        onChange(info) {
            const { status, response } = info.file;
            log(status, info);
            if (status === "done") {
                setChallenge({
                    ...challenge,
                    fileName: response
                });
            } else if (status === "error" || status === "removed") {
                setChallenge({
                    ...challenge,
                    fileName: "",
                });
            }
        },
    };

    return (
        /* @ts-ignore */
        <Modal visible={visible} closable={false} destroyOnClose={true} onClose={onCancelClicked} footer={null}>
            <div className={styles.header}>
                <Title level={4}>{existingChallenge ? "Update Challenge" : "New Challenge"}</Title>
                <Text type='secondary'>Enter challenge details and source code.</Text>
            </div>
            <Text strong>Title</Text>
            <Input
                className={styles.taskInput}
                placeholder='Enter challenge title e.g. "News Feed Code Challenge"'
                onChange={onTitleChange}
                defaultValue={challenge.name}
            />
            <Text strong>Description</Text>
            <TextArea
                className={styles.taskInput}
                autoSize={{ minRows: 2, maxRows: 5 }}
                placeholder='Enter challenge description'
                onChange={onDescriptionChange}
                defaultValue={challenge.description}
            />
            <Text strong>Code</Text>
            <Input
                addonBefore={<GithubFilled style={{ fontSize: 20 }} />}
                className={styles.assessmentAutocomplete}
                placeholder='Public GitHub repository link'
                onChange={onCodeChange}
                defaultValue={challenge.gitHubUrl}
            />

            <div className={styles.orText}>
                <Text type='secondary'>or</Text>
            </div>

            <Dragger {...uploadProps}>
                <div>
                    <img src={UploadCircleIcon} alt='Upload icon' className={styles.uploadIcon} />
                </div>
                <Text type='secondary'>
                    <span className={styles.uploadText}>Click to upload</span> or drag and drop file upto 10 MB
                </Text>
            </Dragger>

            <div className={styles.modalFooter}>
                <div className={styles.dangerButtonHolder}>
                    {existingChallenge && (
                        <Button type='ghost' danger onClick={onDeleteClicked}>
                            Delete
                        </Button>
                    )}
                </div>
                <Space>
                    <Button onClick={onCancelClicked}>Cancel</Button>
                    {!existingChallenge && (
                        <Button type='primary' disabled={!requiredDataIsValid()} onClick={onAddClicked}>
                            Add
                        </Button>
                    )}
                    {existingChallenge && (
                        <Button type='primary' disabled={!requiredDataIsValid()} onClick={onUpdateClicked}>
                            Update
                        </Button>
                    )}
                </Space>
            </div>
        </Modal>
    );
};

export default LiveCodingChallengeModal;
