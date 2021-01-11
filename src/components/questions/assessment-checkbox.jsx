import React, { useState } from 'react';
import styles from "./assessment-checkbox.module.css";
import {
    DislikeOutlined,
    DislikeTwoTone,
    LikeOutlined,
    LikeTwoTone,
    PlusCircleOutlined,
    PlusCircleTwoTone
} from "@ant-design/icons";
import { Space } from "antd";

const NONE = "NONE";
const NO = "NO";
const MAYBE = "MAYBE";
const YES = "YES";

const AssessmentCheckbox = (props) => {

    const [assessment, setAssessment] = useState(props.assessment)

    React.useEffect(() => {
        props.onChange(assessment)
        // eslint-disable-next-line
    }, [assessment]);

    const onDislikeClicked = () => {
        if(!props.disabled) {
            if (assessment === NO) {
                setAssessment(NONE)
            } else {
                setAssessment(NO)
            }
        }
    };

    const onLikeClicked = () => {
        if(!props.disabled) {
            if (assessment === YES) {
                setAssessment(NONE)
            } else {
                setAssessment(YES)
            }
        }
    };

    const onPlusClicked = () => {
        if(!props.disabled) {
            if (assessment === MAYBE) {
                setAssessment(NONE)
            } else {
                setAssessment(MAYBE)
            }
        }
    };

    return (
        <Space size="middle">
            {assessment !== NO && <DislikeOutlined className={styles.icon} onClick={onDislikeClicked} />}
            {assessment === NO && <DislikeTwoTone className={styles.icon} onClick={onDislikeClicked} />}
            {assessment !== MAYBE && <PlusCircleOutlined className={styles.icon} onClick={onPlusClicked} />}
            {assessment === MAYBE && <PlusCircleTwoTone className={styles.icon} onClick={onPlusClicked} />}
            {assessment !== YES && <LikeOutlined className={styles.icon} onClick={onLikeClicked} />}
            {assessment === YES && <LikeTwoTone className={styles.icon} onClick={onLikeClicked} />}
        </Space>
    )
}

export default AssessmentCheckbox