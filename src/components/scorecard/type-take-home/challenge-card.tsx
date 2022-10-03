import styles from "./challenge-card.module.css";
import Card from "../../card/card";
import { TakeHomeChallenge } from "../../../store/models";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import React from "react";
import { isEmpty } from "lodash";
import { FileChallengeLink, GithubChallengeLink } from "../type-live-coding/challenge-card";
import { Divider } from "antd";
import { ButtonSecondary } from "../../buttons/button-secondary";

type Props = {
    teamId: string;
    challenge: Readonly<TakeHomeChallenge>;
    buttonText: string;
    buttonIcon: React.ReactNode;
    onGenerateLink: (challenge: TakeHomeChallenge) => void;
};

export const ChallengeCard = ({ teamId, challenge, buttonText, buttonIcon, onGenerateLink }: Props) => {
    return (
        <Card>
            <Title level={4}>Take Home Assignment</Title>
            <Text type='secondary'>Ask canndidate to complete an assignment and return the results.</Text>
            <div className={styles.taskCard}>
                <Text className={styles.taskName}>{challenge.name}</Text>
                {!isEmpty(challenge.description) && <Text>{challenge.description}</Text>}
                {FileChallengeLink(challenge, teamId)}
                {GithubChallengeLink(challenge)}
                <Divider className={styles.divider} />
                <Text type='secondary'>
                    Share the challenge with the candidate. The link expires once the interview is completed.
                </Text>
                <div>
                    <ButtonSecondary
                        style={{ marginTop: 16 }}
                        onClick={() => onGenerateLink(challenge)}
                        icon={buttonIcon}
                    >
                        {buttonText}
                    </ButtonSecondary>
                </div>
            </div>
        </Card>
    );
};
