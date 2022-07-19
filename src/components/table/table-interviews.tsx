import TableHeader from "./table-header";
import { localeCompare } from "../../utils/comparators";
import TableText from "./table-text";
import styles from "./table-interviews.module.css";
import DemoTag from "../demo/demo-tag";
import { getFormattedDate, getFormattedTime } from "../../utils/date-fns";
import InitialsAvatar from "../avatar/initials-avatar";
import React, { MouseEvent } from "react";
import { Avatar } from "antd";
import InterviewStatusTag from "../tags/interview-status-tags";
import { InterviewData } from "../../store/interviews/selector";
import { ColumnType } from "rc-table/lib/interface";

export const CandidateColumn = (
    onCandidateClicked: (e: MouseEvent, candidateId: string) => void
): ColumnType<InterviewData> => ({
    title: <TableHeader>CANDIDATE</TableHeader>,
    key: "candidateName",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    sorter: (a: InterviewData, b: InterviewData) =>
        localeCompare(a.candidate?.candidateName ?? "", b.candidate?.candidateName ?? ""),
    render: (interview: InterviewData) => (
        <div onClick={e => onCandidateClicked(e, interview.candidateId)}>
            <DemoTag isDemo={interview.isDemo} />
            <TableText className={`${styles.candidateName} fs-mask`}>
                {interview.candidate?.candidateName ?? "-"}
            </TableText>
        </div>
    ),
});

export const InterviewColumn = (): ColumnType<InterviewData> => ({
    title: <TableHeader>INTERVIEW</TableHeader>,
    key: "position",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    sorter: (a: InterviewData, b: InterviewData) => localeCompare(a.position ?? "", b.position ?? ""),
    render: (interview: InterviewData) => <TableText>{interview.position ?? "-"}</TableText>,
});

export const DateColumn = (): ColumnType<InterviewData> => ({
    title: <TableHeader>DATE</TableHeader>,
    key: "startDateTime",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    // @ts-ignore
    sorter: (a: InterviewData, b: InterviewData) => a.startDateTime - b.startDateTime,
    render: (interview: InterviewData) => (
        <div className={styles.tableDateDiv}>
            <TableText>{getFormattedDate(interview.startDateTime)}</TableText>
            <TableText className={styles.tableTime}>at {getFormattedTime(interview.startDateTime)}</TableText>
        </div>
    ),
});

export const InterviewerColumn = (): ColumnType<InterviewData> => ({
    title: <TableHeader>INTERVIEWER</TableHeader>,
    key: "interviewersMember",
    render: (interview: InterviewData) => (
        <Avatar.Group>
            {interview.interviewersMember.map(member => (
                <InitialsAvatar interviewerName={member.name} />
            ))}
        </Avatar.Group>
    ),
});

export const StatusColumn = (): ColumnType<InterviewData> => ({
    title: <TableHeader>STATUS</TableHeader>,
    key: "status",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    sorter: (a: InterviewData, b: InterviewData) => localeCompare(a.status, b.status),
    render: (interview: InterviewData) => (
        <InterviewStatusTag
            interviewStartDateTime={interview.startDateTime}
            status={Array.from(interview.linkedInterviews.map(interview => interview.status)).concat(interview.status)}
        />
    ),
});
