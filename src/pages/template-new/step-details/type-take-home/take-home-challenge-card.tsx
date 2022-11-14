import { TemplateChallenge } from "../../../../store/models";
import styles from "./take-home-challenge-card.module.css";
import Card from "../../../../components/card/card";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import React from "react";
import { Input, UploadProps, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { GithubFilled } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";
import UploadCircleIcon from "../../../../assets/icons/upload-circle.svg";
import { UploadFile } from "antd/lib/upload/interface";
import { log } from "../../../../utils/log";
import { INTERVIEW_TAKE_HOME } from "../../../../utils/interview";
import { uploadChallengeFile } from "../../../../store/challenge/actions";

type Props = {
    teamId: string;
    challenge: Readonly<TemplateChallenge>;
    onUpdateChallenge: (challenge: TemplateChallenge) => void;
};
const TakeHomeChallengeCard = ({ teamId, challenge, onUpdateChallenge }: Props) => {

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateChallenge({
            ...challenge,
            name: e.target.value,
        });
    };

    const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdateChallenge({
            ...challenge,
            description: e.target.value,
        });
    };

    const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateChallenge({
            ...challenge,
            gitHubUrl: e.target.value,
        });
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
                onUpdateChallenge({
                    ...challenge,
                    fileName: response,
                });
            } else if (status === "error" || status === "removed") {
                onUpdateChallenge({
                    ...challenge,
                    fileName: "",
                });
            }
        },
    };

    return (
        <Card className={styles.cardSpace}>
            <Title level={4}>{INTERVIEW_TAKE_HOME}</Title>
            <Text type='secondary'>Ask candidate to complete an assignment and return the results.</Text>
            <Form.Item
                name='assignmentTitle'
                className={styles.title}
                label={<Text strong>Title</Text>}
                rules={[
                    {
                        required: true,
                        message: "Please enter assignment title",
                    },
                ]}
            >
                <Input
                    placeholder='Enter assignment title e.g. "News Feed Application"'
                    onChange={onTitleChange}
                    defaultValue={challenge.name}
                />
            </Form.Item>
            <Form.Item name='assignmentDescription' label={<Text strong>Description</Text>}>
                <TextArea
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    placeholder='Welcome message and assignment instruction for the candidate'
                    onChange={onDescriptionChange}
                    defaultValue={challenge.description}
                />
            </Form.Item>

            <Form.Item name='assignmentCode' label={<Text strong>Code</Text>}>
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
            </Form.Item>
        </Card>
    );
};

export default TakeHomeChallengeCard;
