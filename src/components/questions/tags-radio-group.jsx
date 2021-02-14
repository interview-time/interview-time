import styles from "./tags-radio-group.module.css";
import { Tag } from 'antd';
import { useState } from "react";

const TagsRadioGroup = ({ tags, defaultValue, onChange }) => {

    const [selectedTag, setSelectedTag] = useState(defaultValue)

    const onClick = (tag) => {
        setSelectedTag(tag.name)
        onChange(tag.name)
    }

    return (
        <>
            {tags.map(tag => (
                <>
                    {tag.name === selectedTag && <Tag key={tag.name}
                                                      color={tag.color}
                                                      className={styles.tag}
                                                      onClick={() => onClick(tag)}>
                        {tag.name}
                    </Tag>}
                    {tag.name !== selectedTag && <Tag key={tag.name}
                                                      className={styles.tag}
                                                      onClick={() => onClick(tag)}>
                        {tag.name}
                    </Tag>}
                </>
            ))}
        </>
    );
}

export default TagsRadioGroup