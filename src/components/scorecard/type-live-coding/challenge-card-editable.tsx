import { LiveCodingChallenge } from "../../../store/models";
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
    COPIED,
}

const LiveCodingChallengeCard = ({ challenges, teamId, interviewId, onChallengeSelectionChanged }: Props) => {
    const [buttonState, setButtonState] = useState<ButtonState>(ButtonState.DEFAULT);

    useEffect(() => {
        if (buttonState === ButtonState.COPIED) {
            setTimeout(() => setButtonState(ButtonState.DEFAULT), 1000);
        }
    }, [buttonState]);

    const onGenerateLink = (challenge: LiveCodingChallenge) => {
        if (!challenge.selected) {
            onChallengeSelectionChanged(true, challenge);
        }

        message.info("Link copied to clipboard");
        copy(`${getHost()}${routeLiveCodingChallenge(challenge.shareToken)}`);
        setButtonState(ButtonState.COPIED);
    };

    const getGenerateLinkButtonText = () => {
        switch (buttonState) {
            case ButtonState.DEFAULT:
                return "Copy Challenge Link";
            case ButtonState.COPIED:
                return "Copied to Clipboard";
        }
    };
    return (
        <ChallengeCard
            teamId={teamId}
            challenges={challenges}
            buttonText={getGenerateLinkButtonText()}
            buttonIcon={buttonState === ButtonState.COPIED ? <CheckOutlined /> : <LinkIcon />}
            onGenerateLink={onGenerateLink}
            onChallengeSelectionChanged={onChallengeSelectionChanged}
        />
    );
};

export default LiveCodingChallengeCard;
