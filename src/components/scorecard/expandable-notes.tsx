import React, { useState } from "react";
import { Col, Input, Row, Space } from "antd";
import { Status } from "../../utils/constants";
import styles from "./expandable-notes.module.css";
import { LightingFilledIcon, LightingIcon, RedFlagIcon } from "../../utils/icons";
import { isNotesExpanded, setNotesExpanded } from "../../utils/storage";
import { RedFlagsTags } from "../tags/red-flags-tags";
import { InterviewStatus } from "../../store/models";

const { TextArea } = Input;

type Props = {
    redFlags: RedFlags[];
    notes: string | undefined;
    status: InterviewStatus;
    onNotesChange: (text: string) => void;
    onRedFlagsChange: (flags: string[]) => void;
};

const ExpandableNotes = ({ redFlags, notes, status, onNotesChange, onRedFlagsChange }: Props) => {
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
                                        onChange={e => {
                                            onNotesChange(e.target.value);
                                        }}
                                        defaultValue={notes}
                                    />
                                </div>
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <RedFlagIcon className={styles.redFlagIconBig} />
                                    <span className={styles.notesLabel}>Red flags</span>
                                </Space>
                                {/* @ts-ignore */}
                                <RedFlagsTags flags={redFlags} onChange={onRedFlagsChange} />
                            </Col>
                        </Row>
                    </Col>
                )}
            </div>
        </div>
    );
};

export default ExpandableNotes;
