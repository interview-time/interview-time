import { Challenge } from "../../../store/models";
import styles from "./challenge-card.module.css";
import Text from "antd/lib/typography/Text";
import React from "react";
import Card from "../../card/card";
import Title from "antd/lib/typography/Title";
import CheckCircleIcon from "../../../assets/icons/check-circle.svg";
import { Button, Divider, Input, message, Tooltip } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GithubFilled } from "@ant-design/icons";
import GithubIcon from "../../../assets/icons/github.svg";
import FileDownloadIcon from "../../../assets/icons/file-download.svg";
import { isEmpty } from "lodash";

type Props = {
    challenges: Readonly<Challenge[]>;
    selectedChallenge?: string;
    buttonText: string;
    buttonLoading: boolean;
    buttonIcon: React.ReactNode;
    onChallengeClicked: (challengeId: string) => void;
    onGenerateLink: () => void;
};

export const ChallengeCard = ({
    challenges,
    selectedChallenge,
    buttonText,
    buttonLoading,
    buttonIcon,
    onGenerateLink,
    onChallengeClicked,
}: Props) => {
    return (
        <Card>
            <Title level={4}>Task</Title>
            <Text type='secondary'>Choose tasks to use during the interview.</Text>
            <>
                {challenges.map(challenge => {
                    if (challenge.challengeId === selectedChallenge) {
                        return (
                            <div
                                className={styles.taskCardSelected}
                                onClick={() => onChallengeClicked(challenge.challengeId)}
                            >
                                <div className={styles.taskNameContainer}>
                                    <Text className={styles.taskName}>{challenge.name}</Text>
                                    <img src={CheckCircleIcon} alt='Selected task' />
                                </div>
                                <div className={styles.taskDetailsContainer}>
                                    {challenge.gitHubUrl &&
                                        GitHubChallengeCard(challenge.gitHubUrl, challenge.description)}
                                    {challenge.fileName &&
                                        FileChallengeCard(
                                            buttonText,
                                            buttonLoading,
                                            buttonIcon,
                                            onGenerateLink,
                                            challenge.description
                                        )}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className={styles.taskCard} onClick={() => onChallengeClicked(challenge.challengeId)}>
                                <div className={styles.taskNameContainer}>
                                    <Text className={styles.taskName}>{challenge.name}</Text>
                                    {challenge.gitHubUrl && <GithubChallengeIcon />}
                                    {challenge.fileName && <FileChallengeIcon />}
                                </div>
                            </div>
                        );
                    }
                })}
            </>
        </Card>
    );
};

const FileChallengeCard = (
    buttonText: string,
    buttonLoading: boolean,
    buttonIcon: React.ReactNode,
    onGenerateLink: () => void,
    description?: string
) => {
    const onGenerateLinkClicked = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation(); // prevents selection another challenge
        onGenerateLink();
    };

    return (
        <>
            {!isEmpty(description) && (
                <>
                    <Text className={styles.linkDescription}>{description}</Text>
                    <Divider className={styles.divider} />
                </>
            )}
            <Text type='secondary' className={styles.linkDescription}>
                Generate a one-time link to the task file and share it with the candidate. Access to the link will
                expire once it's used.
            </Text>
            <div>
                <Button
                    type='primary'
                    className={styles.generateLinkButton}
                    loading={buttonLoading}
                    onClick={onGenerateLinkClicked}
                    icon={buttonIcon}
                >
                    {buttonText}
                </Button>
            </div>
        </>
    );
};

const GitHubChallengeCard = (gitHubUrl: string, description?: string) => {
    const onCopy = () => message.info("Link copied to clipboard");

    return (
        <>
            {!isEmpty(description) && (
                <>
                    <Text className={styles.linkDescription}>{description}</Text>
                    <Divider className={styles.divider} />
                </>
            )}
            <Text type='secondary' className={styles.linkDescription}>
                Copy a public link to the task source code and share it with a candidate.
            </Text>
            <div className={styles.taskDetailsButtonContainer}>
                <Input addonBefore={<GithubFilled style={{ fontSize: 20 }} />} value={gitHubUrl} />
                <CopyToClipboard text={gitHubUrl} onCopy={onCopy}>
                    <Button
                        type='primary'
                        className={styles.copyButton}
                        onClick={event => {
                            event.stopPropagation(); // prevents selection another challenge
                        }}
                    >
                        Copy Link
                    </Button>
                </CopyToClipboard>
            </div>
        </>
    );
};

export const GithubChallengeIcon = () => (
    <Tooltip title='Task source code is available via the GitHub link.'>
        <img src={GithubIcon} alt='Download file icon' style={{ cursor: "pointer" }} />
    </Tooltip>
);

export const FileChallengeIcon = () => (
    <Tooltip title='Task source code is available via the download link.'>
        <img src={FileDownloadIcon} alt='Download file icon' style={{ cursor: "pointer" }} />
    </Tooltip>
);
