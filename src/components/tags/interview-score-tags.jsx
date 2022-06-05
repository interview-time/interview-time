import styles from "./interview-score-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { getOverallPerformanceColor, getOverallPerformancePercent } from "../../utils/assessment";

/**
 *
 * @param {Interview} interview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewScoreTag = ({ interview }) => (
    <Tag color={getOverallPerformanceColor(interview.structure.groups)} className={styles.tag}>
        {getOverallPerformancePercent(interview.structure.groups)}
    </Tag>
);

export default InterviewScoreTag;
