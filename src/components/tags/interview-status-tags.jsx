import styles from "./status-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { Status } from "../../utils/constants";

/**
 *
 * @param {Interview} interview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewStatusTag = ({ interviewStartDateTime, status }) => {
    const interviewStarted = () => new Date() > interviewStartDateTime;

    const getClass = () => {
        if (status === Status.SUBMITTED) {
            return styles.tagGreen;
        } else if (status === Status.COMPLETED) {
            return styles.tagOrange;
        } else {
            return interviewStarted() ? styles.tagOrange : styles.tagRed;
        }
    };

    const getText = () => {
        if (status === Status.SUBMITTED) {
            return "Complete";
        } else if (status === Status.COMPLETED) {
            return "Finalizing...";
        } else {
            return interviewStarted() ? "In Progress" : "Upcoming";
        }
    };

    return <Tag className={getClass()}>{getText()}</Tag>;
};

export default InterviewStatusTag;
