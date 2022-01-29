import React from "react";
import { Tag } from "antd";
import { CandidateStatus } from "../utils/constants";
import styles from "./interview-status-tags.module.css";

const CandidateStatusTag = ({ status }) => {
    const getClass = () => {
        if (status === CandidateStatus.HIRE) {
            return styles.tagGreen;
        } else if (status === CandidateStatus.INTERVIEWING) {
            return styles.tagOrange;
        } else if (status === CandidateStatus.NO_HIRE) {
            return styles.tagRed;
        } else {
            return styles.tagGray;
        }
    };

    return <Tag className={getClass()}>{status}</Tag>;
};

export default CandidateStatusTag;
