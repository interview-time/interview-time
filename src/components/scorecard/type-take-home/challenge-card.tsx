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
    candidate?: Readonly<Candidate>;
    sendButtonText: string;
    sendButtonIcon: React.ReactNode;
    linkButtonText: string;
    linkButtonIcon: React.ReactNode;
    onLinkClicked?: (challenge: TakeHomeChallenge) => void;
    onSendClicked?: (challenge: TakeHomeChallenge) => void;
};

export const ChallengeCard = ({
    teamId,
    challenge,
    candidate,
    sendButtonText,
    sendButtonIcon,
    linkButtonText,
    linkButtonIcon,
    onLinkClicked,
    onSendClicked,
}: Props) => {
    const SendChallengeButton = () => {
        const hasEmail = !isEmpty(candidate?.email);
        const button = (
            <ButtonSecondary
                onClick={() => onSendClicked?.(challenge)}
                icon={sendButtonIcon}
                disabled={challenge.status === ChallengeStatus.SolutionSubmitted}
            >
                {sendButtonText}
            </ButtonSecondary>
        );

        return hasEmail ? button : <Tooltip title="Candidate doesn't have email">{button}</Tooltip>;
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
                {onLinkClicked && onSendClicked && (
                    <div className={styles.buttons}>
                        <ButtonSecondary
                            onClick={() => onLinkClicked?.(challenge)}
                            icon={linkButtonIcon}
                            disabled={challenge.status === ChallengeStatus.SolutionSubmitted}
                        >
                            {linkButtonText}
                        </ButtonSecondary>
                        {SendChallengeButton()}
                    </div>
                )}
            </div>
        </Card>
    );
};
