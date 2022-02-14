import styles from "./interview-decision-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { getDecisionColor, getDecisionText } from "../utils/assessment";

/**
 *
 * @param {string} decision
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewDecisionTag = ({ decision }) => (
    <Tag color={getDecisionColor(decision)} className={styles.tag}>
        {getDecisionText(decision)}
    </Tag>
);

export default InterviewDecisionTag;
