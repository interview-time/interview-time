import { LiveCodingChallenge } from "../../../store/models";
import styles from "./challenge-card.module.css";
import React from "react";
import Card from "../../card/card";
import { Typography } from "antd";
import { Divider, message, Switch, Tooltip } from "antd";
import { isEmpty } from "lodash";
import { GithubFilled } from "@ant-design/icons";
import { DownloadFileIcon, DownloadFileOutlinedIcon } from "../../../utils/icons";
import { ButtonSecondary } from "../../buttons/button-secondary";
import { downloadChallengeFile } from "../../../store/challenge/actions";

const { Title, Text } = Typography;

type Props = {
    challenges: Readonly<LiveCodingChallenge[]>;
    teamId: string;
    buttonText: string;
    buttonIcon: React.ReactNode;
    onChallengeSelectionChanged: (selected: boolean, challenge: LiveCodingChallenge) => void;
    onGenerateLink: (challenge: LiveCodingChallenge) => void;
};

export const ChallengeCard = ({
    challenges,
    teamId,
    buttonText,
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

    const onSwitchChanged = (checked: boolean, e: React.MouseEvent, challenge: LiveCodingChallenge) => {
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
            <Text type='secondary'>Choose challenges to use during the interview.</Text>
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
                                checked={challenge.selected}
                                onChange={(checked: boolean, e: React.MouseEvent) => onSwitchChanged(checked, e, challenge)}
                            />
                        </div>
                        {isExpanded && (
                            <>
                                {!isEmpty(challenge.description) && (
                                    <Text className={styles.linkDescription}>{challenge.description}</Text>
                                )}
                                {FileChallengeLink(challenge, teamId)}
                                {GithubChallengeLink(challenge.gitHubUrl)}
                                <Divider className={styles.divider} />
                                <Text type='secondary' className={styles.linkDescription}>
                                    Share the challenge with the candidate. The link expires once the interview is
                                    completed.
                                </Text>
                                <div>
                                    <ButtonSecondary
                                        style={{ marginTop: 16 }}
                                        onClick={(e: React.MouseEvent<HTMLElement>) =>
                                            onGenerateLinkClicked(e, challenge)
                                        }
                                        icon={buttonIcon}
                                    >
                                        {buttonText}
                                    </ButtonSecondary>
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
            <span className={styles.challengeLink} onClick={e => onFileLinkClicked(e, challenge)}>
                <DownloadFileOutlinedIcon style={{ fontSize: 16 }} />
                <span className={styles.challengeText}>{`challenge-file-${challenge.fileName}`}</span>
            </span>
        )
    );
};

export const GithubChallengeLink = (gitHubUrl: string | undefined) => {
    const onLinkClicked = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation(); // prevents selection another challenge
    };

    return (
        !isEmpty(gitHubUrl) && (
            <a
                href={gitHubUrl}
                target='_blank'
                rel='noreferrer'
                className={styles.challengeLink}
                onClick={onLinkClicked}
            >
                <GithubFilled style={{ fontSize: 16 }} />
                <span className={styles.challengeText}>{gitHubUrl}</span>
            </a>
        )
    );
};

export const GithubChallengeIcon = () => (
    <Tooltip title='Challenge source code is available via the GitHub link.'>
        <GithubFilled style={{ fontSize: 20, color: "#9DA3AE" }} />
    </Tooltip>
);

export const FileChallengeIcon = () => (
    <Tooltip title='Challenge source code is available via the download link.'>
        <DownloadFileIcon style={{ fontSize: 20, color: "#9DA3AE" }} />
    </Tooltip>
);
