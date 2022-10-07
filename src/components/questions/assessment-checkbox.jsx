import React, { useState } from "react";
import styles from "./assessment-checkbox.module.css";
import { Rate, Tooltip } from "antd";
import { defaultTo } from "lodash/util";
import { CrossCircleIcon } from "../../utils/icons";
import { QuestionAssessment } from "../../utils/constants";
import { log } from "../../utils/log";
import classNames from "classnames";

export const MAX_ASSESSMENT = 3;

/**
 *
 * @param {number} defaultValue
 * @param {boolean} disabled
 * @param {boolean} hideNoAssessment
 * @param onChange
 * @returns {JSX.Element}
 * @constructor
 */
const AssessmentCheckbox = ({ defaultValue, disabled, hideNoAssessment, onChange }) => {
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
            log("onStarsChanged", value);
        }
    };

    return (
        <div className={classNames({
            [styles.assessmentHolder]: true,
            [styles.withoutCross]: hideNoAssessment,
            [styles.withCross]: !hideNoAssessment,
        })}>
            <Rate
                count={MAX_ASSESSMENT}
                defaultValue={defaultTo(defaultValue, 0)}
                disabled={disabled}
                onChange={onStarsChanged}
                value={value}
                tooltips={["Poor answer", "Good answer", "Excellent answer"]}
            />
            {!hideNoAssessment && (
                <div
                    className={`${styles.crossHolder} ${
                        value === QuestionAssessment.UNANSWERED ? "assessed" : "not-assessed"
                    }`}
                    onClick={onNoAnswerClicked}
                >
                    <Tooltip title='No answer'>
                        <CrossCircleIcon
                            style={{ color: value === QuestionAssessment.UNANSWERED ? "#EF4444" : "#D2D5DA" }}
                        />
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default AssessmentCheckbox;
