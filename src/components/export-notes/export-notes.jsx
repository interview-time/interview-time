import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styles from "./export-notes.module.css";

const { TextArea } = Input;

const ExportNotes = ({ interview }) => {
    const [notes, setNotes] = useState(() => {
        var questionNotes = "";

        interview.structure.groups.map((group) => {
            group.questions.map((q) => {
                if (q.notes) {
                    questionNotes += `- ${q.question}\n${q.notes}\n\n`;
                }
            });
        });
        return `${questionNotes} == General Notes== \n${interview.notes}`;
    });

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        var timeoutId;

        if (copied) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                setCopied(false);
            }, 1000);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [copied]);

    return (
        <div>
            <TextArea
                autoSize={{ minRows: 10, maxRows: 20 }}
                onChange={(e) => setNotes(e.target.value)}
                defaultValue={notes}
            />
            <div className={styles.action}>
                <CopyToClipboard text={notes} onCopy={() => setCopied(true)}>
                    <Button type="primary" icon={copied ? <CheckOutlined /> : <CopyOutlined />}>
                        {copied ? "Copied!" : "Copy to clipboard"}
                    </Button>
                </CopyToClipboard>
            </div>
        </div>
    );
};

export default ExportNotes;
