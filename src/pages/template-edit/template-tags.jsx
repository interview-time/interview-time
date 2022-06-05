import { defaultTo } from "lodash/util";
import { Select, Tag } from "antd";
import styles from "./template.module.css";
import React from "react";
import { getTagColor } from "../../components/utils/constants";

/**
 *
 * @param {Question} question
 * @param {[]} allTags
 * @param onTagsChange
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplateTags = ({ question, allTags, onTagsChange }) => {
    const tagRender = ({ label }) => {
        return (
            <Tag className={styles.clickableTag} color={getTagColor(label)} style={{ marginRight: 4 }}>
                {label.toLowerCase()}
            </Tag>
        );
    };

    return (
        <Select
            mode='tags'
            style={{ width: "100%" }}
            onChange={tags => onTagsChange(question, tags)}
            size='small'
            defaultValue={defaultTo(question.tags, [])}
            placeholder='Tags'
            options={allTags}
            tagRender={tagRender}
        />
    );
};
