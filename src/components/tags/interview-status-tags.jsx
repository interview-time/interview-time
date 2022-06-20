import styles from "./status-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { Status } from "../../utils/constants";

/**
 *
 * @param {Date} interviewStartDateTime
 * @param {string} status
 * @param {[string]} statuses
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewStatusTag = ({ interviewStartDateTime, status, statuses }) => {
    const interviewStarted = () => new Date() > interviewStartDateTime;

    const createTag = () => {
        let statusesArr = status ? Array.from(status) : statuses;
        let tagClass;
        let tagText;
        if (statusesArr.every(status => status === Status.SUBMITTED)) {
            tagClass = styles.tagGreen;
            tagText = "Complete";
        } else if (statusesArr.find(status => status === Status.COMPLETED)) {
            tagClass = styles.tagOrange;
            tagText = "Finalizing…";
        } else if (interviewStarted()) {
            tagClass = styles.tagOrange;
            tagText = "In Progress";
        } else {
            tagClass = styles.tagRed;
            tagText = "Upcoming";
        }

        return <Tag className={tagClass}>{tagText}</Tag>;
    };

    return createTag();
};

export default InterviewStatusTag;
