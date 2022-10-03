import { ChallengeCard } from "./challenge-card";
import { TakeHomeChallenge } from "../../../store/models";
import { LinkIcon } from "../../../utils/icons";
import React from "react";
import { message } from "antd";

type Props = {
    teamId: string;
    challenge: Readonly<TakeHomeChallenge>;
};

const TakeHomeChallengeCard = ({ teamId, challenge }: Props) => {
    const onNotAvailable = () => {
        message.error("Not available in this mode.");
    };

    return (
        <ChallengeCard
            teamId={teamId}
            challenge={challenge}
            buttonText='Copy Challenge Link'
            buttonIcon={<LinkIcon />}
            onGenerateLink={onNotAvailable}
        />
    );
};

export default TakeHomeChallengeCard;
