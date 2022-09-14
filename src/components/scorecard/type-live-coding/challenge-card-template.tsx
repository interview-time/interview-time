import { Challenge } from "../../../store/models";
import React from "react";
import { message } from "antd";
import { LinkIcon } from "../../../utils/icons";
import { ChallengeCard } from "./challenge-card";

type Props = {
    challenges: Readonly<Challenge[]>;
};

const LiveCodingChallengeCard = ({ challenges }: Props) => {
    const [selectedChallenge, setSelectedChallenge] = React.useState<string | undefined>();

    const onChallengeClicked = (challengeId: string) => {
        if (selectedChallenge === challengeId) {
            setSelectedChallenge(undefined);
        } else {
            setSelectedChallenge(challengeId);
        }
    };

    const onGenerateLinkClicked = () => {
        message.error("Not available in this mode.");
    };

    return (
        <ChallengeCard
            challenges={challenges}
            selectedChallenge={selectedChallenge}
            buttonText='Generate and Copy Link'
            buttonLoading={false}
            buttonIcon={<LinkIcon />}
            onGenerateLink={onGenerateLinkClicked}
            onChallengeClicked={onChallengeClicked}
        />
    );
};

export default LiveCodingChallengeCard;
