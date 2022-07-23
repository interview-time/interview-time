import styles from "./interview-decision-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { getDecisionColor, getDecisionText } from "../../utils/assessment";

type Props = {
    decision: number;
};
const InterviewDecisionTag = ({ decision }: Props) => (
    <div>
        <Tag color={getDecisionColor(decision)} className={styles.tag}>
            {getDecisionText(decision)}
        </Tag>
    </div>
);

export default InterviewDecisionTag;
