import React from 'react';
import { Rate } from "antd";
import { defaultTo } from "lodash/util";

/**
 *
 * @param {number} defaultValue
 * @param {boolean} disabled
 * @param onChange
 * @returns {JSX.Element}
 * @constructor
 */
const AssessmentCheckbox = ({ defaultValue, disabled , onChange}) => {

    return (
        <Rate
            count={3}
            defaultValue={defaultTo(defaultValue, 0)}
            disabled={disabled}
            onChange={onChange}
            tooltips={["Poor answer", "Average answer", "Good answer"]}
        />
    )
}

export default AssessmentCheckbox