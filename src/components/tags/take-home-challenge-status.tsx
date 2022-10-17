import styles from "./status-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { ChallengeStatus } from "../../store/models";

type Props = {
    status?: ChallengeStatus;
};
const TakeHomeChallengeStatusTag = ({ status }: Props) => {
    const createTag = () => {
        let tagClass;
        let tagText;
        if (status === ChallengeStatus.SolutionSubmitted) {
            tagClass = styles.tagGreen;
            tagText = "Completed";
        } else if (status === ChallengeStatus.SentToCandidate) {
            tagClass = styles.tagOrange;
            tagText = "Sent";
        } else {
            tagClass = styles.tagRed;
            tagText = "Not Sent";
        }

        return <Tag className={tagClass}>{tagText}</Tag>;
    };

    return createTag();
};

export default TakeHomeChallengeStatusTag;
