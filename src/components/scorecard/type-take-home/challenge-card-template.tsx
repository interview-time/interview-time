import { ChallengeCard } from "./challenge-card";
import { TakeHomeChallenge } from "../../../store/models";
import { LinkIcon, MailIcon } from "../../../utils/icons";
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
            linkButtonText='Copy Assignment Link'
            linkButtonIcon={<LinkIcon style={{ fontSize: 18 }}/>}
            sendButtonText='Send to Candidate'
            sendButtonIcon={<MailIcon style={{ fontSize: 18 }}/>}
            onLinkClicked={onNotAvailable}
            onSendClicked={onNotAvailable}
        />
    );
};

export default TakeHomeChallengeCard;
