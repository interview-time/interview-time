import styles from "./challenge-card.module.css";
import Card from "../../card/card";
import { Candidate, ChallengeStatus, TakeHomeChallenge } from "../../../store/models";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import React from "react";
import { isEmpty } from "lodash";
import { FileChallengeLink, GithubChallengeLink } from "../type-live-coding/challenge-card";
import { Divider, Tooltip } from "antd";
import { ButtonSecondary } from "../../buttons/button-secondary";
import TakeHomeChallengeStatusTag from "../../tags/take-home-challenge-status";
import { getFormattedDate } from "../../../utils/date-fns";
import { INTERVIEW_TAKE_HOME_TASK } from "../../../utils/interview";

type Props = {
    teamId: string;
    challenge: Readonly<TakeHomeChallenge>;
    generateLinkButton: ButtonProps;
    sendEmailButton: ButtonProps;
};

type ButtonProps = {
    text: string;
    loading?: boolean;
    disabled?: boolean;
    tooltip?: string;
    icon: React.ReactNode;
    onClick?: (challenge: TakeHomeChallenge) => void;
};

export const ChallengeCard = ({ teamId, challenge, generateLinkButton, sendEmailButton }: Props) => {
    const SendChallengeButton = () => {
        const button = (
            <ButtonSecondary
                onClick={() => sendEmailButton.onClick?.(challenge)}
                icon={sendEmailButton.icon}
                loading={sendEmailButton.loading}
                disabled={challenge.status === ChallengeStatus.SolutionSubmitted || sendEmailButton.disabled}
            >
                {sendEmailButton.text}
            </ButtonSecondary>
        );

        return sendEmailButton.tooltip ? (
            <Tooltip title={sendEmailButton.tooltip}>
                {/*div is required to show Tooltip for disabled button*/}
                <div>{button}</div>
            </Tooltip>
        ) : (
            button
        );
    };

    return (
        <Card>
            <Title level={4}>{INTERVIEW_TAKE_HOME_TASK}</Title>
            <Text type='secondary'>Ask candidate to complete an assignment and return the results.</Text>
            <div className={styles.taskCard}>
                <div className={styles.taskNameHolder}>
                    <Text className={styles.taskName}>{challenge.name}</Text>
                    <TakeHomeChallengeStatusTag status={challenge.status} />
                </div>
                {!isEmpty(challenge.description) && <Text>{challenge.description}</Text>}
                {FileChallengeLink(challenge, teamId)}
                {GithubChallengeLink(challenge.gitHubUrl)}
                <Text className={styles.taskSolution}>Solution</Text>
                <Text>
                    {challenge.status === ChallengeStatus.SolutionSubmitted
                        ? `Take home assignment solution submitted on ${getFormattedDate(
                              challenge.solutionSubmittedOn
                          )}.`
                        : "Take home assignment solution submitted by the candidate will be available here."}
                </Text>
                {challenge.solutionGitHubUrls && challenge.solutionGitHubUrls.map(url => GithubChallengeLink(url))}
                <Divider className={styles.divider} />
                <Text type='secondary'>
                    Share the assignment with the candidate. The link expires once the interview is completed.
                </Text>
                <div className={styles.buttons}>
                    <ButtonSecondary
                        onClick={() => generateLinkButton.onClick?.(challenge)}
                        icon={generateLinkButton.icon}
                        disabled={challenge.status === ChallengeStatus.SolutionSubmitted || generateLinkButton.disabled}
                    >
                        {generateLinkButton.text}
                    </ButtonSecondary>
                    {SendChallengeButton()}
                </div>
            </div>
        </Card>
    );
};
