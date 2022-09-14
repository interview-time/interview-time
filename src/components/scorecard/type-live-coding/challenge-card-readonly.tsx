import { Challenge } from "../../../store/models";
import React from "react";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import styles from "./challenge-card.module.css";
import { FileChallengeIcon, GithubChallengeIcon } from "./challenge-card";
import Card from "../../card/card";

type Props = {
    challenge?: Readonly<Challenge>;
};

const LiveCodingChallengeCard = ({ challenge }: Props) => {
    return (
        <Card>
            <Title level={4}>Task</Title>
            <Text type='secondary'>Coding task that candidate did for this interview.</Text>
            {challenge && (
                <div className={styles.taskCard}>
                    <div className={styles.taskNameContainer}>
                        <Text className={styles.taskName}>{challenge.name}</Text>
                        {challenge.gitHubUrl && <GithubChallengeIcon />}
                        {challenge.fileName && <FileChallengeIcon />}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default LiveCodingChallengeCard;
