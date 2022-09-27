import { LiveCodingChallenge } from "../../../store/models";
import { generateInterviewChallengeToken } from "../../../utils/http";
import { useEffect, useState } from "react";
import { message } from "antd";
import copy from "copy-to-clipboard";
import { LinkIcon } from "../../../utils/icons";
import { CheckOutlined } from "@ant-design/icons";
import { ChallengeCard } from "./challenge-card";
import { getHost, routeLiveCodingChallenge } from "../../../utils/route";

type Props = {
    challenges: Readonly<LiveCodingChallenge[]>;
    teamId: string;
    interviewId: string;
    onChallengeSelectionChanged: (selected: boolean, challenge: LiveCodingChallenge) => void;
};

enum ButtonState {
    DEFAULT,
    LOADING,
    SUCCESS,
}

const LiveCodingChallengeCard = ({ challenges, teamId, interviewId, onChallengeSelectionChanged }: Props) => {
    const [buttonState, setButtonState] = useState<ButtonState>(ButtonState.DEFAULT);

    useEffect(() => {
        if (buttonState === ButtonState.SUCCESS) {
            setTimeout(() => setButtonState(ButtonState.DEFAULT), 1000);
        }
    }, [buttonState]);

    const onGenerateLink = (challenge: LiveCodingChallenge) => {
        if (challenge.selected) {
            setButtonState(ButtonState.LOADING);
            generateInterviewChallengeToken(
                teamId,
                challenge.challengeId,
                interviewId,
                (token: string) => {
                    setButtonState(ButtonState.SUCCESS);
                    message.info("Link copied to clipboard");
                    copy(`${getHost()}${routeLiveCodingChallenge(token)}`);
                },
                () => {
                    setButtonState(ButtonState.DEFAULT);
                    message.error("Error during link generation, please try again");
                }
            );
        }
    };

    const getGenerateLinkButtonText = () => {
        switch (buttonState) {
            case ButtonState.DEFAULT:
                return "Generate and Copy Link";
            case ButtonState.LOADING:
                return "Generating Link...";
            case ButtonState.SUCCESS:
                return "Copied to clipboard";
        }
    };
    return (
        <ChallengeCard
            teamId={teamId}
            challenges={challenges}
            buttonText={getGenerateLinkButtonText()}
            buttonLoading={buttonState === ButtonState.LOADING}
            buttonIcon={buttonState === ButtonState.SUCCESS ? <CheckOutlined /> : <LinkIcon />}
            onGenerateLink={onGenerateLink}
            onChallengeSelectionChanged={onChallengeSelectionChanged}
        />
    );
};

export default LiveCodingChallengeCard;
