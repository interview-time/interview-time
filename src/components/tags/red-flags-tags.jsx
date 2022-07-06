import { useEffect, useRef, useState } from "react";
import { Input, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./red-flags-tags.module.css";

/**
 *
 * @param {[RedFlags]} flags
 * @param onChange
 * @returns {JSX.Element}
 * @constructor
 */
export const RedFlagsTags = ({ flags, onChange }) => {
    const [tags, setTags] = useState(flags.sort((a, b) => a.order - b.order).map(flag => flag.label));
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState("");

    const inputRef = useRef(null);
    const editInputRef = useRef(null);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    useEffect(() => {
        editInputRef.current?.focus();
    }, [inputValue]);

    const editable = onChange != null

    const handleClose = removedTag => {
        const newTags = tags.filter(tag => tag !== removedTag);
        setTags(newTags);
        onChange(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = e => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            const newTags = [...tags, inputValue];
            setTags(newTags);
            onChange(newTags);
        }

        setInputVisible(false);
        setInputValue("");
    };

    const handleEditInputChange = e => {
        setEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        onChange(newTags);
        setEditInputIndex(-1);
        setInputValue("");
    };

    return (
        <div>
            {tags.map((tag, index) => {
                if (editInputIndex === index) {
                    return (
                        <Input
                            ref={editInputRef}
                            key={tag}
                            size='small'
                            className={styles.tagInput}
                            value={editInputValue}
                            onChange={handleEditInputChange}
                            onBlur={handleEditInputConfirm}
                            onPressEnter={handleEditInputConfirm}
                        />
                    );
                }

                return (
                    <Tag
                        className={styles.tagInput}
                        key={tag}
                        closable={editable}
                        onClose={() => handleClose(tag)}
                        color='red'
                    >
                        <span
                            onClick={e => {
                                if(editable) {
                                    setEditInputIndex(index);
                                    setEditInputValue(tag);
                                    e.preventDefault();
                                }
                            }}
                        >
                            {tag}
                        </span>
                    </Tag>
                );
            })}
            {editable && inputVisible && (
                <Input
                    ref={inputRef}
                    type='text'
                    size='small'
                    className={styles.tagInput}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {editable && !inputVisible && (
                <Tag className={styles.siteTagPlus} onClick={showInput}>
                    <PlusOutlined /> New red flag
                </Tag>
            )}
        </div>
    );
};
