import { LiveCodingChallenge } from "../../../store/models";
import React from "react";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import styles from "./challenge-card.module.css";
import Card from "../../card/card";
import { isEmpty } from "lodash";
import { FileChallengeLink, GithubChallengeLink } from "./challenge-card";

type Props = {
    teamId: string;
    challenges: Readonly<LiveCodingChallenge[]>;
};

const LiveCodingChallengeCard = ({ teamId, challenges }: Props) => {
    return (
        <Card>
            <Title level={4}>Challenges</Title>
            <Text type='secondary'>Coding challenge that candidate did for this interview.</Text>
            {challenges
                .filter(challenge => challenge.selected)
                .map(challenge => {
                    return (
                        <div className={styles.taskCardSelectedReadonly}>
                            <Text className={styles.taskName}>{challenge.name}</Text>
                            {!isEmpty(challenge.description) && (
                                <Text className={styles.linkDescription}>{challenge.description}</Text>
                            )}
                            {FileChallengeLink(challenge, teamId)}
                            {GithubChallengeLink(challenge)}
                        </div>
                    );
                })}
        </Card>
    );
};

export default LiveCodingChallengeCard;
