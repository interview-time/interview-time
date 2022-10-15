import styles from "./interview-type-tag.module.css";
import { Tag } from "antd";
import React from "react";
import { InterviewType } from "../../store/models";
import { interviewTypeToColor, interviewTypeToNameShort } from "../../utils/interview";

type Props = {
    interviewType: InterviewType;
};
const InterviewTypeTag = ({ interviewType }: Props) => (
    <Tag
        className={styles.tag}
        style={{ borderColor: interviewTypeToColor(interviewType), color: interviewTypeToColor(interviewType) }}
    >
        {interviewTypeToNameShort(interviewType)}
    </Tag>
);

export default InterviewTypeTag;
