import React from "react";
import { Card, Input } from "antd";
import Title from "antd/lib/typography/Title";
import { Status } from "../../components/utils/constants";
import styles from "./interview-sections.module.css";

const { TextArea } = Input;

const NotesSection = ({ notes, status, onChange, className }) => {
    return (
        <div className={`${styles.notes} ${className}`}>
            <Title level={4}>Notes</Title>

            <TextArea
                {...(status === Status.COMPLETED ? { readonly: "true" } : {})}
                className={styles.notesTextArea}
                placeholder="Interview notes..."
                bordered={false}
                autoSize={{ minRows: 6, maxRows: 6 }}
                autoFocus={true}
                onChange={onChange}
                defaultValue={notes}
            />
        </div>
    );
};

export default NotesSection;
