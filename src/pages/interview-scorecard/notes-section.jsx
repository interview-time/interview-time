import React, { useState } from "react";
import { Switch, Input } from "antd";
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
                <span>
                    <Text type="secondary">Sticky notes</Text>
                    <Switch
                        className={styles.notesSwitch}
                        size="small"
                        defaultChecked
                        onChange={(checked) => {
                            setStickyNotesEnabled(checked);
                            setIsSticky(checked);
                        }}
                    />
                </span>
            </div>

            <TextArea
                {...(status === Status.COMPLETED ? { readonly: "true" } : {})}
                className={styles.notesTextArea}
                placeholder="Interview notes..."
                bordered={false}            
                autoSize={{ minRows: 6, maxRows: 6 }}
                onChange={onChange}
                defaultValue={notes}
            />
        </div>
    );
};

export default NotesSection;
