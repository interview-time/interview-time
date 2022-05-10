import React, { useState } from "react";
import styles from "./assessment-checkbox.module.css";
import { Rate, Space, Tooltip } from "antd";
import { defaultTo } from "lodash/util";
import { CrossCircleIcon } from "../utils/icons";
import { QuestionAssessment } from "../utils/constants";

/**
 *
 * @param {number} defaultValue
 * @param {boolean} disabled
 * @param onChange
 * @returns {JSX.Element}
 * @constructor
 */
const AssessmentCheckbox = ({ defaultValue, disabled, onChange }) => {
    const [value, setValue] = useState(defaultValue);

    const onNoAnswerClicked = () => {
        if (!disabled) {
            let newValue =
                value === QuestionAssessment.UNANSWERED
                    ? QuestionAssessment.NO_ASSESSMENT
                    : QuestionAssessment.UNANSWERED;
            setValue(newValue);
            onChange?.(newValue);
        }
    };

    const onStarsChanged = value => {
        if (!disabled) {
            setValue(value);
            onChange?.(value);
            console.log("onStarsChanged", value);
        }
    };

    return (
        <Space>
            <div className={styles.crossHolder} onClick={onNoAnswerClicked}>
                <Tooltip title='No answer'>
                    <CrossCircleIcon
                        style={{ color: value === QuestionAssessment.UNANSWERED ? "#EF4444" : "#D2D5DA" }}
                    />
                </Tooltip>
            </div>
            <Rate
                count={3}
                defaultValue={defaultTo(defaultValue, 0)}
                disabled={disabled}
                onChange={onStarsChanged}
                value={value}
                tooltips={["Poor answer", "Good answer", "Excellent answer"]}
            />
        </Space>
    );
};

export default AssessmentCheckbox;
