import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
    getGroupAssessmentPercent,
    getGroupAssessmentText,
    getOverallPerformancePercent,
} from "../../components/utils/assessment";
import styles from "./export-notes.module.css";

const { TextArea } = Input;

const ExportNotes = ({ interview }) => {
    const [notes, setNotes] = useState(() => {
        var questionNotes = `${interview.candidate}\n`;
        questionNotes += "---------------------------------\n";
        questionNotes += `Overall Performance Score: ${getOverallPerformancePercent(
            interview.structure.groups
        )}%\n`;
        questionNotes += "---------------------------------\n";

        if (interview.structure.groups && interview.structure.groups.length > 1) {
            interview.structure.groups.forEach((group) => {
                questionNotes += `${group.name}: ${getGroupAssessmentPercent(
                    group
                )}% (${getGroupAssessmentText(group)})\n`;
            });

            questionNotes += "---------------------------------\n\n";
        }

        interview.structure.groups.forEach((group) => {
            group.questions.forEach((q) => {
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
