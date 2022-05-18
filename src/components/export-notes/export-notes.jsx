import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
    getGroupAssessment,
    getGroupAssessmentEmoji,
    getOverallPerformancePercent,
    getQuestionsWithAssessment,
} from "../utils/assessment";
import styles from "./export-notes.module.css";
import { InterviewAssessment } from "../utils/constants";
import { defaultTo } from "lodash/util";
import { filterGroupsWithAssessment } from "../utils/filters";
import { getFormattedDateTime } from "../utils/date-fns";

const { TextArea } = Input;

export const DATE_FORMAT_DISPLAY = "MMM DD, YYYY hh:mm a";

const ExportNotes = ({ interview }) => {
    const isCandidateQualified =
        interview.decision === InterviewAssessment.YES || interview.decision === InterviewAssessment.STRONG_YES;

    const [notes, setNotes] = useState(() => {
        let competenceAreas = "";
        if (interview.structure.groups && interview.structure.groups.length > 1) {
            let longestName = 0;
            interview.structure.groups.forEach(group => {
                let name = group.name.substring(0, 12);
                if (name.length > longestName) {
                    longestName = name.length;
                }
            });
            filterGroupsWithAssessment(interview.structure.groups)
                .map(group => ({
                    group: group,
                    assessment: getGroupAssessment(group.questions),
                }))
                .forEach(({ group, assessment }, index) => {
                    const emoji = getGroupAssessmentEmoji(assessment.score);
                    let name = group.name.substring(0, 20);
                    if (index !== 0) {
                        competenceAreas += "\n";
                    }
                    competenceAreas += `${name.padEnd(longestName + 5, " ")} ${assessment.score}% ${emoji} ${
                        assessment.text
                    }`;
                });
        }

        let notes = "There are no notes.";
        if (interview.notes && interview.notes.length > 0) {
            notes = interview.notes;
        }

        let questionNotes = "";
        defaultTo(interview.structure.groups, []).forEach(group => {
            group.questions.forEach(q => {
                if (q.notes) {
                    questionNotes += `- ${q.question}\n${q.notes}\n\n`;
                }
            });
        });

        return `
Candidate Report

Candidate Name: ${interview.candidate}
Position: ${interview.position}
Interview Date: ${getFormattedDateTime(interview.interviewDateTime)}

Overall Performance Score: ${getOverallPerformancePercent(interview.structure.groups)}%
Total questions asked: ${getQuestionsWithAssessment(interview.structure.groups).length}
Recommendation: ${isCandidateQualified ? "qualified for the position" : "not qualified for the position"}

Competence Areas
${competenceAreas}

Notes
${notes}

Question Notes
${questionNotes}
        `.trim();
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
                style={{ fontFamily: "monospace" }}
                autoSize={{ minRows: 10, maxRows: 20 }}
                onChange={e => setNotes(e.target.value)}
                defaultValue={notes}
            />
            <div className={styles.action}>
                <CopyToClipboard text={notes} onCopy={() => setCopied(true)}>
                    <Button type='primary' icon={copied ? <CheckOutlined /> : <CopyOutlined />}>
                        {copied ? "Copied!" : "Copy to clipboard"}
                    </Button>
                </CopyToClipboard>
            </div>
        </div>
    );
};

export default ExportNotes;
