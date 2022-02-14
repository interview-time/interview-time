import { defaultTo } from "lodash/util";
import { Select, Tag } from "antd";
import styles from "./template.module.css";
import React from "react";

/**
 *
 * @param {Question} question
 * @param {String[]} questionsTags
 * @param {Map} tagColors
 * @param onTagsChange
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplateTags = ({ question, questionsTags, tagColors, onTagsChange }) => {
    const tagRender = ({ label }) => (
        <Tag className={styles.clickableTag} color={tagColors.get(label)} style={{ marginRight: 4 }}>
            {label.toLowerCase()}
        </Tag>
    );

    return (
        <Select
            mode='tags'
            style={{ width: "100%" }}
            onChange={tags => onTagsChange(question.questionId, tags)}
            size='small'
            defaultValue={defaultTo(question.tags, [])}
            placeholder='Tags'
            options={questionsTags}
            tagRender={tagRender}
        />
    );
};
