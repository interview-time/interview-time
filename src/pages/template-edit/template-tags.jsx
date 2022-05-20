import { defaultTo } from "lodash/util";
import { Select, Tag } from "antd";
import styles from "./template.module.css";
import React from "react";

/**
 *
 * @param {Question} question
 * @param {[]} allTags
 * @param {Map} allTagsColors
 * @param onTagsChange
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplateTags = ({ question, allTags, allTagsColors, onTagsChange }) => {
    const tagRender = ({ label }) => (
        <Tag className={styles.clickableTag} color={allTagsColors.get(label)} style={{ marginRight: 4 }}>
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
            options={allTags}
            tagRender={tagRender}
        />
    );
};
