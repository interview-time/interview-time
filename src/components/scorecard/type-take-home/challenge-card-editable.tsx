import { ChallengeCard } from "./challenge-card";
import { TakeHomeChallenge } from "../../../store/models";
import { LinkIcon, MailIcon } from "../../../utils/icons";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { getHost, routeTakeHomeChallenge } from "../../../utils/route";

type Props = {
    teamId: string;
    challenge: Readonly<TakeHomeChallenge>;
};

enum LinkButtonState {
    DEFAULT,
    COPIED,
}

const TakeHomeChallengeCard = ({ teamId, challenge }: Props) => {

    const [buttonState, setButtonState] = useState<LinkButtonState>(LinkButtonState.DEFAULT);

    useEffect(() => {
        if (buttonState === LinkButtonState.COPIED) {
            setTimeout(() => setButtonState(LinkButtonState.DEFAULT), 1000);
        }
    }, [buttonState]);

    const onNotAvailable = () => {
        message.error("Not available in this mode.");
    };

    const onGenerateLink = (challenge: TakeHomeChallenge) => {
        message.info("Link copied to clipboard");
        copy(`${getHost()}${routeTakeHomeChallenge(challenge.shareToken)}`);
        setButtonState(LinkButtonState.COPIED);
    };

    const getGenerateLinkButtonText = () => {
        switch (buttonState) {
            case LinkButtonState.DEFAULT:
                return "Copy Assignment Link";
            case LinkButtonState.COPIED:
                return "Copied to Clipboard";
        }
    };

    const getGenerateLinkIcon = () =>
        buttonState === LinkButtonState.COPIED ? (
            <CheckOutlined style={{ fontSize: 18 }} />
        ) : (
            <LinkIcon style={{ fontSize: 18 }} />
        );

    return (
        <ChallengeCard
            teamId={teamId}
            challenge={challenge}
            linkButtonText={getGenerateLinkButtonText()}
            linkButtonIcon={getGenerateLinkIcon()}
            sendButtonText='Send to Candidate'
            sendButtonIcon={<MailIcon style={{ fontSize: 18 }} />}
            onLinkClicked={onGenerateLink}
            onSendClicked={onNotAvailable}
        />
    );
};

export default TakeHomeChallengeCard;
