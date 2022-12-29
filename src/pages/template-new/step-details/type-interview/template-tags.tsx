import { defaultTo } from "lodash";
import { Select, Tag } from "antd";
import styles from "./template-tags.module.css";
import React from "react";
import { TemplateQuestion } from "../../../../store/models";
import { getTagColor } from "../../../../utils/color";

type Props = {
    question: TemplateQuestion;
    allTags: any[];
    onTagsChange: (question: TemplateQuestion, tags: string[]) => void;
};

export const TemplateTags = ({ question, allTags, onTagsChange }: Props) => {
    // @ts-ignore
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
