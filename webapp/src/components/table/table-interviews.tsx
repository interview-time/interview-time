import { ColumnType } from "rc-table/lib/interface";
import React from "react";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { FormLabelSmall } from "../../assets/styles/global-styles";
import { InterviewData } from "../../store/interviews/selector";
import { Interview } from "../../store/models";
import { localeCompare } from "../../utils/comparators";
import { getFormattedDate, getFormattedTime } from "../../utils/date-fns";
import { interviewWithoutDate, NO_DATE_LABEL } from "../../utils/interview";
import DemoTag from "../demo/demo-tag";
import TableHeader from "./table-header";

const PrimarySecondaryText = styled.div`
    display: flex;
    flex-direction: column;
`;

const FormLabelSecondary = styled(FormLabelSmall)`
    margin-top: -2px;
    color: ${Colors.Neutral_500};
`;

export const CandidateColumn = (): ColumnType<Interview> => ({
    title: <TableHeader>CANDIDATE</TableHeader>,
    key: "candidateName",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    sorter: (a: InterviewData, b: InterviewData) => localeCompare(a.candidate || "", b.candidate || ""),
    render: (interview: Interview) => (
        <div>
            <DemoTag isDemo={interview.isDemo} />
            <FormLabelSmall className='fs-mask'>{interview.candidate ?? "Unknown"}</FormLabelSmall>
        </div>
    ),
});

export const JobColumn = (): ColumnType<Interview> => ({
    title: <TableHeader>INTERVIEW</TableHeader>,
    key: "interview",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    render: (interview: Interview) => (
        <PrimarySecondaryText>
            <FormLabelSmall>{interview.jobTitle || "-"}</FormLabelSmall>
            {interview.stageTitle && <FormLabelSecondary>{interview.stageTitle}</FormLabelSecondary>}
        </PrimarySecondaryText>
    ),
});

export const DateColumn = (): ColumnType<Interview> => ({
    title: <TableHeader>DATE</TableHeader>,
    key: "startDateTime",
    // @ts-ignore
    sortDirections: ["descend", "ascend"],
    // @ts-ignore
    sorter: (a: Interview, b: Interview) => a.parsedStartDateTime - b.parsedStartDateTime,
    render: (interview: Interview) => (
        <PrimarySecondaryText>
            <FormLabelSmall>
                {interviewWithoutDate(interview) ? NO_DATE_LABEL : getFormattedDate(interview.parsedStartDateTime)}
            </FormLabelSmall>
            {!interviewWithoutDate(interview) && (
                <FormLabelSecondary>at {getFormattedTime(interview.parsedStartDateTime)}</FormLabelSecondary>
            )}
        </PrimarySecondaryText>
    ),
});
