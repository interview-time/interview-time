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
            generateLinkButton={{
                text: "Copy Assignment Link",
                icon: <LinkIcon style={{ fontSize: 18 }}/>,
                onClick: onNotAvailable,
            }}
            sendEmailButton={{
                text: "Send to Candidate",
                icon: <MailIcon style={{ fontSize: 18 }}/>,
                onClick: onNotAvailable,
            }}
        />
    );
};

export default TakeHomeChallengeCard;
