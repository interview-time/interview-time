import styles from "./interview-score-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { getOverallPerformanceColor, getOverallPerformancePercent } from "../../utils/assessment";
import { InterviewData } from "../../store/interviews/selector";

type Props = {
    interview: InterviewData;
};
const InterviewScoreTag = ({ interview }: Props) => (
    <Tag color={getOverallPerformanceColor(interview.structure.groups)} className={styles.tag}>
        {getOverallPerformancePercent(interview.structure.groups)}
    </Tag>
);

export default InterviewScoreTag;
