import React, { useState } from "react";
import { Input, Switch, Tooltip } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { Status } from "../../components/utils/constants";
import { isStickyNotesEnabled, setStickyNotesEnabled } from "../../components/utils/storage";
import styles from "./interview-sections.module.css";

const { TextArea } = Input;

const NotesSection = ({ notes, status, onChange }) => {
    const [isSticky, setIsSticky] = useState(isStickyNotesEnabled());

    return (
        <div className={`${styles.notes} ${isSticky ? styles.stickyNotes : ""}`}>
            <div className={styles.notesHeader}>
                <Title level={4}>Notes</Title>
                <Tooltip title="Notes always visible during scroll">
                <span>
                    <Text type="secondary">Always visible</Text>
                    <Switch
                        className={styles.notesSwitch}
                        defaultChecked={isSticky}
                        size="small"
                        onChange={(checked) => {
                            setStickyNotesEnabled(checked);
                            setIsSticky(checked);
                        }}
                    />
                </span>
                </Tooltip>
            </div>

            <TextArea
                {...(status === Status.COMPLETED ? { readonly: "true" } : {})}
                className={styles.notesTextArea + " fs-mask"}
                placeholder="Interview notes..."
                bordered={false}
                autoSize={{ minRows: 3, maxRows: 6 }}
                onChange={onChange}
                defaultValue={notes}
            />
        </div>
    );
};

export default NotesSection;
