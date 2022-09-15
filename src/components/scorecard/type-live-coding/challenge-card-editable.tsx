import { Challenge } from "../../../store/models";
import { generateInterviewChallengeToken } from "../../../utils/http";
import { useEffect, useState } from "react";
import { message } from "antd";
import copy from "copy-to-clipboard";
import { LinkIcon } from "../../../utils/icons";
import { CheckOutlined } from "@ant-design/icons";
import { ChallengeCard } from "./challenge-card";
import { getApiUrl, getHost, routeLiveCodingChallenge } from "../../../utils/route";

type Props = {
    challenges: Readonly<Challenge[]>;
    selectedChallengeId?: string;
    teamId: string;
    interviewId: string;
    onChallengeSelected: (challengeId: string | undefined) => void;
};

enum ButtonState {
    DEFAULT,
    LOADING,
    SUCCESS,
}

const LiveCodingChallengeCard = ({
    challenges,
    selectedChallengeId,
    teamId,
    interviewId,
    onChallengeSelected,
}: Props) => {
    const [selectedChallenge, setSelectedChallenge] = useState<string | undefined>(selectedChallengeId);

    const [buttonState, setButtonState] = useState<ButtonState>(ButtonState.DEFAULT);

    useEffect(() => {
        if (buttonState === ButtonState.SUCCESS) {
            setTimeout(() => setButtonState(ButtonState.DEFAULT), 1000);
        }
    }, [buttonState]);

    const onChallengeClicked = (challengeId: string) => {
        if (buttonState !== ButtonState.LOADING) {
            if (selectedChallenge === challengeId) {
                setSelectedChallenge(undefined);
                onChallengeSelected(undefined);
            } else {
                setSelectedChallenge(challengeId);
                onChallengeSelected(challengeId);
            }
        }
    };

    const onGenerateLink = () => {
        if (selectedChallenge) {
            setButtonState(ButtonState.LOADING);
            generateInterviewChallengeToken(
                teamId,
                selectedChallenge,
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
            challenges={challenges}
            selectedChallenge={selectedChallenge}
            buttonText={getGenerateLinkButtonText()}
            buttonLoading={buttonState === ButtonState.LOADING}
            buttonIcon={buttonState === ButtonState.SUCCESS ? <CheckOutlined /> : <LinkIcon />}
            onGenerateLink={onGenerateLink}
            onChallengeClicked={onChallengeClicked}
        />
    );
};

export default LiveCodingChallengeCard;
