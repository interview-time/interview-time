import { ChallengeCard } from "./challenge-card";
import { Candidate, TakeHomeChallenge } from "../../../store/models";
import { LinkIcon, MailIcon } from "../../../utils/icons";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { getHost, routeTakeHomeChallenge } from "../../../utils/route";
import { SendChallengeProps } from "../../../store/challenge/actions";
import { isEmpty } from "lodash";

type Props = {
    interviewId: string;
    teamId: string;
    challenge: Readonly<TakeHomeChallenge>;
    candidate?: Readonly<Candidate>;
    sendChallenge: (props: SendChallengeProps) => void;
};

enum LinkButtonState {
    DEFAULT,
    COPIED,
}

enum EmailButtonState {
    DEFAULT,
    LOADING,
    SENT,
}

const TakeHomeChallengeCard = ({ interviewId, teamId, challenge, candidate, sendChallenge }: Props) => {
    const [generateLinkState, setGenerateLinkState] = useState<LinkButtonState>(LinkButtonState.DEFAULT);
    const [sendEmailState, setSendEmailState] = useState<EmailButtonState>(EmailButtonState.DEFAULT);

    useEffect(() => {
        if (generateLinkState === LinkButtonState.COPIED) {
            setTimeout(() => setGenerateLinkState(LinkButtonState.DEFAULT), 1000);
        }
    }, [generateLinkState]);

    useEffect(() => {
        if (sendEmailState === EmailButtonState.SENT) {
            setTimeout(() => setSendEmailState(EmailButtonState.DEFAULT), 1000);
        }
    }, [sendEmailState]);

    const onSendChallenge = () => {
        setSendEmailState(EmailButtonState.LOADING);
        sendChallenge({
            interviewId: interviewId,
            challengeId: challenge.challengeId,
            sendViaLink: false,
            onSuccess: () => {
                message.info("Take home assignment sent to candidate");
                setSendEmailState(EmailButtonState.SENT);
            },
            onError: () => {
                message.info("Error sending assignment to candidate");
                setSendEmailState(EmailButtonState.DEFAULT);
            },
        });
    };

    const onGenerateLink = (challenge: TakeHomeChallenge) => {
        sendChallenge({
            interviewId: interviewId,
            challengeId: challenge.challengeId,
            sendViaLink: true,
        });
        copy(`${getHost()}${routeTakeHomeChallenge(challenge.shareToken)}`);
        setGenerateLinkState(LinkButtonState.COPIED);
        message.info("Link copied to clipboard");
    };

    const getGenerateLinkButtonText = () => {
        switch (generateLinkState) {
            case LinkButtonState.DEFAULT:
                return "Copy Assignment Link";
            case LinkButtonState.COPIED:
                return "Copied to Clipboard";
        }
    };

    const getGenerateLinkIcon = () => {
        switch (generateLinkState) {
            case LinkButtonState.DEFAULT:
                return <LinkIcon style={{ fontSize: 18 }} />;
            case LinkButtonState.COPIED:
                return <CheckOutlined style={{ fontSize: 18 }} />;
        }
    };

    const getSendEmailButtonText = () => {
        switch (sendEmailState) {
            case EmailButtonState.DEFAULT:
                return "Send to Candidate";
            case EmailButtonState.LOADING:
                return "Sending...";
            case EmailButtonState.SENT:
                return "Assignment Sent";
        }
    };

    const getSendEmailIcon = () => {
        switch (sendEmailState) {
            case EmailButtonState.DEFAULT:
                return <MailIcon style={{ fontSize: 18 }} />;
            case EmailButtonState.SENT:
                return <CheckOutlined style={{ fontSize: 18 }} />;
        }
    };

    return (
        <ChallengeCard
            teamId={teamId}
            challenge={challenge}
            generateLinkButton={{
                text: getGenerateLinkButtonText(),
                icon: getGenerateLinkIcon(),
                onClick: onGenerateLink,
            }}
            sendEmailButton={{
                text: getSendEmailButtonText(),
                icon: getSendEmailIcon(),
                loading: sendEmailState === EmailButtonState.LOADING,
                disabled: isEmpty(candidate?.email),
                tooltip: isEmpty(candidate?.email) ? "Candidate email is not available" : undefined,
                onClick: onSendChallenge,
            }}
        />
    );
};

export default TakeHomeChallengeCard;
