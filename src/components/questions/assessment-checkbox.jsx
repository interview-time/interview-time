import React, {useState} from 'react';
import styles from "./assessment-checkbox.module.css";
import {
    DislikeOutlined,
    DislikeTwoTone,
    LikeOutlined,
    LikeTwoTone,
    PlusCircleOutlined,
    PlusCircleTwoTone
} from "@ant-design/icons";
import {Space} from "antd";

const AssessmentCheckbox = () => {
    const NONE = 0;
    const DISLIKE = 1;
    const PLUS = 2;
    const LIKE = 3;

    const [assessment, setAssessment] = useState(NONE)

    const onDislikeClicked = () => {
        if (assessment === DISLIKE) {
            setAssessment(NONE)
        } else {
            setAssessment(DISLIKE)
        }
    };

    const onLikeClicked = () => {
        if (assessment === LIKE) {
            setAssessment(NONE)
        } else {
            setAssessment(LIKE)
        }
    };

    const onPlusClicked = () => {
        if (assessment === PLUS) {
            setAssessment(NONE)
        } else {
            setAssessment(PLUS)
        }
    };

    return (
        <Space size="middle">
            {assessment !== DISLIKE && <DislikeOutlined className={styles.icon} onClick={onDislikeClicked} />}
            {assessment === DISLIKE && <DislikeTwoTone className={styles.icon} onClick={onDislikeClicked} />}
            {assessment !== PLUS && <PlusCircleOutlined className={styles.icon} onClick={onPlusClicked} />}
            {assessment === PLUS && <PlusCircleTwoTone className={styles.icon} onClick={onPlusClicked} />}
            {assessment !== LIKE && <LikeOutlined className={styles.icon} onClick={onLikeClicked} />}
            {assessment === LIKE && <LikeTwoTone className={styles.icon} onClick={onLikeClicked} />}
        </Space>
    )
}

export default AssessmentCheckbox