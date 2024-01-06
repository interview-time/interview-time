import { ChallengeCard } from "./challenge-card";
import { TakeHomeChallenge } from "../../../store/models";
import { LinkIcon, MailIcon } from "../../../utils/icons";
import React from "react";

type Props = {
    teamId: string;
    challenge: Readonly<TakeHomeChallenge>;
};

const TakeHomeChallengeCard = ({ teamId, challenge }: Props) => {
    return (
        <ChallengeCard
            teamId={teamId}
            challenge={challenge}
            generateLinkButton={{
                text: "Copy Assignment Link",
                icon: <LinkIcon style={{ fontSize: 18 }} />,
                disabled: true,
            }}
            sendEmailButton={{
                text: "Send to Candidate",
                icon: <MailIcon style={{ fontSize: 18 }} />,
                disabled: true,
            }}
        />
    );
};

export default TakeHomeChallengeCard;
