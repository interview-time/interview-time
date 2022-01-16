import moment from "moment";
import styles from "./interview-status-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { Status } from "../utils/constants";

/**
 *
 * @param {Interview} interview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewStatusTag = ({ interview }) => {

    const interviewStarted = () => moment() > moment(interview.interviewDateTime);

    const getClass = () => {
        if (interview.status === Status.SUBMITTED) {
            return styles.tagGreen
        } else if (interview.status === Status.COMPLETED) {
            return styles.tagOrange
        } else {
            return interviewStarted() ? styles.tagOrange : styles.tagRed
        }
    }

    const getText = () => {
        if (interview.status === Status.SUBMITTED) {
            return "Complete"
        } else if (interview.status === Status.COMPLETED) {
            return "Finalizing..."
        } else {
            return interviewStarted() ? "In Progress" : "Upcoming"
        }
    }

    return <Tag className={getClass()}>{getText()}</Tag>
}

export default InterviewStatusTag