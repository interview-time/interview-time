import { LiveCodingChallenge } from "../../../store/models";
import styles from "./challenge-card.module.css";
import Text from "antd/lib/typography/Text";
import React from "react";
import Card from "../../card/card";
import Title from "antd/lib/typography/Title";
import { Button, Divider, message, Switch, Tooltip } from "antd";
import GithubIcon from "../../../assets/icons/github.svg";
import FileDownloadIcon from "../../../assets/icons/file-download.svg";
import FileDownloadIconSmall from "../../../assets/icons/file-download-outlined-small.svg";
import { isEmpty } from "lodash";
import { GithubFilled } from "@ant-design/icons";
import { downloadChallengeFile } from "../../../utils/http";

type Props = {
    challenges: Readonly<LiveCodingChallenge[]>;
    teamId: string;
    buttonText: string;
    buttonLoading: boolean;
    buttonIcon: React.ReactNode;
    onChallengeSelectionChanged: (selected: boolean, challenge: LiveCodingChallenge) => void;
    onGenerateLink: (challenge: LiveCodingChallenge) => void;
};

export const ChallengeCard = ({
    challenges,
    teamId,
    buttonText,
    buttonLoading,
    buttonIcon,
    onGenerateLink,
    onChallengeSelectionChanged,
}: Props) => {
    const [expandedChallenge, setExpandedChallenge] = React.useState<string | undefined>();

    const onGenerateLinkClicked = (e: React.MouseEvent<HTMLElement>, challenge: LiveCodingChallenge) => {
        e.stopPropagation(); // prevents selection another challenge
        onGenerateLink(challenge);
    };

    const onChallengeClicked = (challengeId: string) => {
        if (expandedChallenge === challengeId) {
            setExpandedChallenge(undefined);
        } else {
            setExpandedChallenge(challengeId);
        }
    };

    const onSwitchChanged = (checked: boolean, e: MouseEvent, challenge: LiveCodingChallenge) => {
        e.stopPropagation(); // prevents selection another challenge
        onChallengeSelectionChanged(checked, challenge);
    };

    const getChallengesTitle = () => {
        const selected = challenges.filter((challenge: LiveCodingChallenge) => challenge.selected).length;
        return selected > 0 ? `Challenges (${selected} selected)` : "Challenges";
    };

    return (
        <Card>
            <Title level={4}>{getChallengesTitle()}</Title>
            <Text type='secondary'>Choose tasks to use during the interview.</Text>
            {challenges.map(challenge => {
                const isExpanded = challenge.challengeId === expandedChallenge;
                return (
                    <div
                        className={challenge.selected ? styles.taskCardSelected : styles.taskCard}
                        onClick={() => onChallengeClicked(challenge.challengeId)}
                    >
                        <div className={styles.taskNameContainer}>
                            <Text className={styles.taskName}>{challenge.name}</Text>
                            <Switch
                                defaultChecked={challenge.selected}
                                onChange={(checked: boolean, e: MouseEvent) => onSwitchChanged(checked, e, challenge)}
                            />
                        </div>
                        {isExpanded && (
                            <>
                                {!isEmpty(challenge.description) && (
                                    <Text className={styles.linkDescription}>{challenge.description}</Text>
                                )}
                                {FileChallengeLink(challenge, teamId)}
                                {GithubChallengeLink(challenge)}
                                <Divider className={styles.divider} />
                                <Text type='secondary' className={styles.linkDescription}>
                                    Generate a public link to the task source code and share it with a candidate. Public
                                    link access will expire once you complete interview.
                                </Text>
                                <div>
                                    <Button
                                        type='primary'
                                        className={styles.generateLinkButton}
                                        loading={buttonLoading}
                                        onClick={e => onGenerateLinkClicked(e, challenge)}
                                        icon={buttonIcon}
                                    >
                                        {buttonText}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </Card>
    );
};

export const FileChallengeLink = (challenge: LiveCodingChallenge, teamId: string) => {
    const onFileLinkClicked = (e: React.MouseEvent<HTMLElement>, challenge: LiveCodingChallenge) => {
        e.stopPropagation(); // prevents selection another challenge
        downloadChallengeFile(
            teamId,
            challenge.challengeId,
            challenge.fileName!,
            url => window.open(url),
            () => message.error("Error during file download, please try again")
        );
    };

    return (
        !isEmpty(challenge.fileName) && (
            <a target='_blank' className={styles.challengeLink} onClick={e => onFileLinkClicked(e, challenge)}>
                <img src={FileDownloadIconSmall} alt='Download file icon' />
                <span className={styles.challengeText}>{`task-file-${challenge.fileName}`}</span>
            </a>
        )
    );
};

export const GithubChallengeLink = (challenge: LiveCodingChallenge) => {
    const onLinkClicked = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation(); // prevents selection another challenge
    };

    return (
        !isEmpty(challenge.gitHubUrl) && (
            <a href={challenge.gitHubUrl} target='_blank' className={styles.challengeLink} onClick={onLinkClicked}>
                <GithubFilled style={{ fontSize: 16 }} />
                <span className={styles.challengeText}>{challenge.gitHubUrl}</span>
            </a>
        )
    );
};

export const GithubChallengeIcon = () => (
    <Tooltip title='Task source code is available via the GitHub link.'>
        <img src={GithubIcon} alt='Github file icon' style={{ cursor: "pointer" }} />
    </Tooltip>
);

export const FileChallengeIcon = () => (
    <Tooltip title='Task source code is available via the download link.'>
        <img src={FileDownloadIcon} alt='Download file icon' style={{ cursor: "pointer" }} />
    </Tooltip>
);
