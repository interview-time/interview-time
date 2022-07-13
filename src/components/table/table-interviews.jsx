import TableHeader from "./table-header";
import { localeCompare } from "../../utils/comparators";
import TableText from "./table-text";
import styles from "./table-interviews.module.css";
import DemoTag from "../demo/demo-tag";
import { defaultTo } from "lodash/util";
import { getFormattedDate, getFormattedTime } from "../../utils/date-fns";
import InitialsAvatar from "../avatar/initials-avatar";
import React from "react";
import { Avatar } from "antd";
import InterviewStatusTag from "../tags/interview-status-tags";

export const CandidateColumn = onCandidateClicked => ({
    title: <TableHeader>CANDIDATE</TableHeader>,
    key: "candidateName",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => localeCompare(a.candidateName, b.candidateName),
    render: interview => (
        <div onClick={e => onCandidateClicked(e, interview.candidateId)}>
            <DemoTag isDemo={interview.isDemo} />
            <TableText className={`${styles.candidateName} fs-mask`}>{interview.candidateName}</TableText>
        </div>
    ),
});

export const InterviewColumn = () => ({
    title: <TableHeader>INTERVIEW</TableHeader>,
    key: "position",
    dataIndex: "position",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => localeCompare(a.position, b.position),
    render: position => <TableText>{defaultTo(position, "-")}</TableText>,
});

export const DateColumn = () => ({
    title: <TableHeader>DATE</TableHeader>,
    key: "interviewStartDateTime",
    dataIndex: "interviewStartDateTime",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.interviewStartDateTime - b.interviewStartDateTime,
    render: interviewStartDateTime => (
        <div className={styles.tableDateDiv}>
            <TableText>{getFormattedDate(interviewStartDateTime)}</TableText>
            <TableText className={styles.tableTime}>at {getFormattedTime(interviewStartDateTime)}</TableText>
        </div>
    ),
});

export const InterviewerColumn = () => ({
    title: <TableHeader>INTERVIEWER</TableHeader>,
    key: "interviewerName",
    render: interview => (
        <Avatar.Group>
            <InitialsAvatar interviewerName={interview.interviewerName} />
            {interview.coInterviewers.map(coInterview => (
                <InitialsAvatar interviewerName={coInterview.interviewerName} />
            ))}
        </Avatar.Group>
    ),
});

export const StatusColumn = () => ({
    title: <TableHeader>STATUS</TableHeader>,
    key: "status",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => localeCompare(a.status, b.status),
    render: interview => (
        <InterviewStatusTag
            interviewStartDateTime={interview.interviewStartDateTime}
            statuses={Array.from(interview.coInterviewers.map(interview => interview.status)).concat(interview.status)}
        />
    ),
});
