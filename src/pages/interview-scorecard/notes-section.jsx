import React, { useState } from "react";
import { Col, Input, Space, Switch } from "antd";
import { Status } from "../../utils/constants";
import styles from "./interview-sections.module.css";
import { LightingIcon, LightingSmallIcon } from "../../utils/icons";
import Text from "antd/lib/typography/Text";
import { isNotesExpanded, setNotesExpanded } from "../../utils/storage";

const { TextArea } = Input;

const NotesSection = ({ notes, status, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(isNotesExpanded());

    const onExpandClicked = () => {
        setIsExpanded(true);
        setNotesExpanded(true);
    };

    const onCollapseClicked = () => {
        setIsExpanded(false);
        setNotesExpanded(false);
    };

    const CollapsedNotes = () => (
        <div className={styles.notesCollapsed} onClick={onExpandClicked}>
            <div className={styles.quickNotesLabelSmallHolder}>
                <LightingSmallIcon className={styles.iconNotesSmall} />
                <span className={styles.quickNotesLabelSmall}>Quick notes</span>
            </div>
            <div className={styles.notesCollapsedDivider} />
        </div>
    );

    const ExpandedNotes = () => (
        <div className={styles.notes}>
            <Col span={24} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
                <div className={styles.notesHeader}>
                    <Space>
                        <LightingIcon className={styles.iconNotesBig} />
                        <span className={styles.quickNotesLabel}>Quick notes</span>
                    </Space>
                    <Space>
                        <Switch
                            className={styles.notesSwitch}
                            defaultChecked={!isExpanded}
                            onChange={() => onCollapseClicked()}
                        />
                        <Text type='secondary'>Minimize</Text>
                    </Space>
                </div>

                <TextArea
                    {...(status === Status.COMPLETED ? { readonly: "true" } : {})}
                    className={styles.notesTextArea}
                    placeholder='Enter generic notes here'
                    bordered={false}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    onChange={onChange}
                    defaultValue={notes}
                />
            </Col>
        </div>
    );

    return isExpanded ? ExpandedNotes() : CollapsedNotes();
};

export default NotesSection;
