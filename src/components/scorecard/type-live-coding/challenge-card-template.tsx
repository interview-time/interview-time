import { LiveCodingChallenge } from "../../../store/models";
import React from "react";
import { message } from "antd";
import { LinkIcon } from "../../../utils/icons";
import { ChallengeCard } from "./challenge-card";

type Props = {
    teamId: string;
    challenges: Readonly<LiveCodingChallenge[]>;
    onChallengeSelectionChanged: (selected: boolean, challenge: LiveCodingChallenge) => void;
};

const LiveCodingChallengeCard = ({ teamId, challenges, onChallengeSelectionChanged }: Props) => {
    const onNotAvailable = () => {
        message.error("Not available in this mode.");
    };

    return (
        <ChallengeCard
            teamId={teamId}
            challenges={challenges}
            buttonText='Generate and Copy Link'
            buttonLoading={false}
            buttonIcon={<LinkIcon />}
            onGenerateLink={onNotAvailable}
            onChallengeSelectionChanged={onChallengeSelectionChanged}
        />
    );
};

export default LiveCodingChallengeCard;
