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
            linkButtonText='Copy Assignment Link'
            linkButtonIcon={<LinkIcon style={{ fontSize: 18 }}/>}
            sendButtonText='Send to Candidate'
            sendButtonIcon={<MailIcon style={{ fontSize: 18 }}/>}
        />
    );
};

export default TakeHomeChallengeCard;
