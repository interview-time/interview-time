import TableHeader from "./table-header";
import { localeCompare } from "../../utils/comparators";
import TableText from "./table-text";
import styles from "./table-interviews.module.css";
import DemoTag from "../demo/demo-tag";
import { getFormattedDate, getFormattedTime } from "../../utils/date-fns";
import InitialsAvatar from "../avatar/initials-avatar";
import React from "react";
import { Avatar } from "antd";
import InterviewStatusTag from "../tags/interview-status-tags";
import { getCandidateName, InterviewData } from "../../store/interviews/selector";
import { ColumnType } from "rc-table/lib/interface";
import { Link } from "react-router-dom";
import { routeCandidateDetails, routeInterviewReport, routeInterviewScorecard } from "../../utils/route";
import { InterviewStatus } from "../../store/models";
import { interviewWithoutDate, NO_DATE_LABEL } from "../../utils/interview";

export const CandidateColumn = (clickable: boolean): ColumnType<InterviewData> => ({
    title: <TableHeader>CANDIDATE</TableHeader>,
    key: "candidateName",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    sorter: (a: InterviewData, b: InterviewData) => localeCompare(getCandidateName(a), getCandidateName(b)),
    render: (interview: InterviewData) => {
        const getLink = () => {
            const candidateName = getCandidateName(interview);
            if (clickable && interview.candidateId) {
                // candidate details available
                return <Link to={routeCandidateDetails(interview.candidateId)}>{candidateName}</Link>;
            }

            // show black text
            return candidateName;
        };

        return (
            <div>
                <DemoTag isDemo={interview.isDemo} />
                <TableText className='fs-mask'>{getLink() ?? ""}</TableText>
            </div>
        );
    },
});

export const InterviewColumn = (userId: string, clickable: boolean): ColumnType<InterviewData> => ({
    title: <TableHeader>INTERVIEW</TableHeader>,
    key: "position",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    sorter: (a: InterviewData, b: InterviewData) => localeCompare(a.position ?? "", b.position ?? ""),
    render: (interview: InterviewData) => {
        const getLink = () => {
            const text = interview.position ?? "Interview";
            if (clickable && interview.status === InterviewStatus.SUBMITTED) {
                // submitted interview, open report
                return <Link to={routeInterviewReport(interview.interviewId)}>{text}</Link>;
            } else if (clickable && userId === interview.userId) {
                // current user is an interviewer, open scorecard
                return <Link to={routeInterviewScorecard(interview.interviewId)}>{text}</Link>;
            }

            // show black text
            return text;
        };

        return <TableText>{getLink()}</TableText>;
    },
});

export const TemplateColumn = (): ColumnType<InterviewData> => ({
    title: <TableHeader>INTERVIEW</TableHeader>,
    key: "templateName",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    sorter: (a: InterviewData, b: InterviewData) =>
        localeCompare(a.templateName ?? a.position ?? "", b.templateName ?? b.position ?? ""),
    render: (interview: InterviewData) => <TableText>{interview.templateName ?? interview.position ?? ""}</TableText>,
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
            <TableText>{interviewWithoutDate(interview) ? NO_DATE_LABEL : getFormattedDate(interview.startDateTime)}</TableText>
            {!interviewWithoutDate(interview) && (
                <TableText className={styles.tableTime}>at {getFormattedTime(interview.startDateTime)}</TableText>
            )}
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
