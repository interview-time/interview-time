import React, { useState } from "react";
import { Col, Input, Row, Space } from "antd";
import { Status } from "../../utils/constants";
import styles from "./interview-sections.module.css";
import { LightingFilledIcon, LightingIcon, RedFlagIcon } from "../../utils/icons";
import { isNotesExpanded, setNotesExpanded } from "../../utils/storage";
import { RedFlagsTags } from "../../components/tags/red-flags-tags";

const { TextArea } = Input;

/**
 *
 * @param {[RedFlags]} redFlags
 * @param {string} notes
 * @param {string} status
 * @param onNotesChange
 * @param onRedFlagsChange
 * @returns {JSX.Element}
 * @constructor
 */
const NotesSection = ({ redFlags, notes, status, onNotesChange, onRedFlagsChange }) => {
    const [isExpanded, setIsExpanded] = useState(isNotesExpanded());

    const onNotesClicked = () => {
        let newValue = !isExpanded;
        setIsExpanded(newValue);
        setNotesExpanded(newValue);
    };

    return (
        <div className={styles.notesRoot}>
            <div className={styles.notesButtonHolder}>
                <span className={styles.notesButton} onClick={onNotesClicked}>
                    {!isExpanded && <LightingIcon className={styles.notesIconSmall} />}
                    {isExpanded ? "Minimize" : "Quick notes"}
                </span>
            </div>
            <div className={styles.notesHolder}>
                {isExpanded && (
                    <Col span={22} offset={1} className={styles.notesCol}>
                        <Row>
                            <Col span={16}>
                                <Space>
                                    <LightingFilledIcon className={styles.notesIconBig} />
                                    <span className={styles.notesLabel}>Notes</span>
                                </Space>

                                <div className={styles.redFlagsHolder}>
                                    <TextArea
                                        {...(status === Status.COMPLETED ? { readonly: "true" } : {})}
                                        className={styles.notesTextArea}
                                        placeholder='Enter generic notes here'
                                        bordered={false}
                                        autoSize={{ minRows: 3, maxRows: 6 }}
                                        onChange={onNotesChange}
                                        defaultValue={notes}
                                    />
                                </div>
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <RedFlagIcon className={styles.redFlagIconBig} />
                                    <span className={styles.notesLabel}>Red flags</span>
                                </Space>
                                <RedFlagsTags flags={redFlags} onChange={onRedFlagsChange} />
                            </Col>
                        </Row>
                    </Col>
                )}
            </div>
        </div>
    );
};

export default NotesSection;
