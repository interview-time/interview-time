import styles from "./status-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { TakeHomeChallengeStatus } from "../../store/models";

type Props = {
    status?: TakeHomeChallengeStatus;
};
const TakeHomeChallengeStatusTag = ({ status }: Props) => {
    const createTag = () => {
        let tagClass;
        let tagText;
        if (status === TakeHomeChallengeStatus.SolutionSubmitted) {
            tagClass = styles.tagGreen;
            tagText = "Completed";
        } else if (status === TakeHomeChallengeStatus.SentToCandidate) {
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
