import React, { useState } from 'react';
import styles from "./assessment-checkbox.module.css";
import {
    DislikeOutlined,
    DislikeTwoTone,
    LikeOutlined,
    LikeTwoTone,
    TrophyOutlined,
    TrophyTwoTone
} from "@ant-design/icons";
import { Space, Tooltip } from "antd";

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
        if (!props.disabled) {
            if (assessment === NO) {
                setAssessment(NONE)
            } else {
                setAssessment(NO)
            }
        }
    };

    const onLikeClicked = () => {
        if (!props.disabled) {
            if (assessment === YES) {
                setAssessment(NONE)
            } else {
                setAssessment(YES)
            }
        }
    };

    const onPlusClicked = () => {
        if (!props.disabled) {
            if (assessment === MAYBE) {
                setAssessment(NONE)
            } else {
                setAssessment(MAYBE)
            }
        }
    };

    return (
        <Space size="middle">
            {assessment !== YES && <Tooltip title="Excellent answer">
                <TrophyOutlined className={styles.icon} onClick={onLikeClicked} />
            </Tooltip>}
            {assessment === YES && <Tooltip title="Excellent answer">
                <TrophyTwoTone className={styles.icon} onClick={onLikeClicked} twoToneColor='#faad14' />
            </Tooltip>}
            {assessment !== MAYBE && <Tooltip title="Good answer">
                <LikeOutlined className={styles.icon} onClick={onPlusClicked} />
            </Tooltip>}
            {assessment === MAYBE && <Tooltip title="Good answer">
                <LikeTwoTone className={styles.icon} onClick={onPlusClicked} twoToneColor='#52c41a' />
            </Tooltip>}
            {assessment !== NO && <Tooltip title="Poor answer">
                <DislikeOutlined className={styles.icon} onClick={onDislikeClicked} />
            </Tooltip>}
            {assessment === NO && <Tooltip title="Poor answer">
                <DislikeTwoTone className={styles.icon} onClick={onDislikeClicked} twoToneColor='#ff4d4f' />
            </Tooltip>}
        </Space>
    )
}

export default AssessmentCheckbox