import styles from "../../components/scorecard/type-live-coding/assessment-card.module.css";
import { isEmpty } from "../../utils/date";
import { NoteIcon } from "../../utils/icons";
import React from "react";
import { Interview, InterviewQuestion, InterviewType } from "../../store/models";
import { Input } from "antd";
import { ExpandableConfig } from "rc-table/lib/interface";

const { TextArea } = Input;

// @ts-ignore
export const emptyInterview = (): Interview => ({
    interviewId: "",
    interviewType: InterviewType.INTERVIEW,
    structure: {
        header: "",
        groups: [],
        footer: "",
    },
});

export const expandableNotes = (
    questions: InterviewQuestion[],
    onQuestionNotesChanged?: (questionId: string, notes: string) => void
): ExpandableConfig<InterviewQuestion> => {
    const primaryIconStyle = { color: "#8C2BE3", fontSize: 18 };
    const greyIconStyle = { color: "#9CA3AF", fontSize: 18 };

    return {
        expandIconColumnIndex: 3,
        expandRowByClick: true,
        defaultExpandedRowKeys: questions.map((question, index) => (question.notes ? index : -1)),
        expandedRowRender: (question: InterviewQuestion) => (
            <TextArea
                className={styles.questionNotesArea}
                placeholder='Notes'
                bordered={false}
                autoSize={true}
                autoFocus={true}
                readOnly={onQuestionNotesChanged === undefined ? true : undefined}
                defaultValue={question.notes}
                onChange={e => {
                    if (onQuestionNotesChanged) {
                        onQuestionNotesChanged(question.questionId, e.target.value);
                    }
                }}
            />
        ),
        // @ts-ignore
        expandIcon: ({ onExpand, record }) =>
            !isEmpty(record.notes) ? (
                // @ts-ignore
                <NoteIcon style={primaryIconStyle} onClick={e => onExpand(record, e)} />
            ) : (
                // @ts-ignore
                <NoteIcon style={greyIconStyle} onClick={e => onExpand(record, e)} />
            ),
    };
};
