import React from "react";
import { Interview, InterviewStatus } from "../../store/models";
import styled from "styled-components";
import { getFormattedDateShort, parseDateISO } from "../../utils/date-fns";
import InitialsAvatar from "../../components/avatar/initials-avatar";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import { CalendarDays, ChevronRight, CheckCircle } from "lucide-react";
import InterviewScoreTag from "../../components/tags/interview-score-tags";
import { InterviewData } from "../../store/interviews/selector";
import { useHistory } from "react-router-dom";
import { routeInterviewReport } from "../../utils/route";
import { addHours } from "date-fns";

const Header = styled.div`
    display: flex;
    margin-bottom: 16px;
`;

const Stage = styled.div`
    display: flex;
`;

const Divider = styled.div`
    border-left: 2px solid ${({ isCompleted }: DividerProps) => (isCompleted ? "#22c55e" : "#F59E0B")};
    margin-left: 15px;
    margin-right: 39px;
    margin-bottom: 4px;
    border-radius: 8px;
    margin-top: -12px;
`;

const StageName = styled.div`
    font-size: 20px;
    font-weight: 600;
    line-height: 32px;
    margin-left: 24px;
    margin-right: 24px;
`;

const InterviewDate = styled.div`
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 400;
    line-height: 20px;
`;

const InterviewsSection = styled.div`
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
    border-spacing: 0;
    margin-bottom: 32px;
    width: 100%;
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06);
`;

const InterviewsTable = styled.table`
    width: max-content;
    min-width: 100%;
    border-spacing: 0;
    text-align: left;
    table-layout: auto;
`;

const InterviewHeader = styled.th`
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const InterviewCell = styled.td`
    padding-top: 16px;
    width: ${({ width }: StageProps) => `${width}%`};
    ${({ isLast }: StageProps) =>
        !isLast &&
        `
        padding-bottom: 16px;
        border-bottom: 1px solid #e5e7eb;
    `}
    ${({ isLink }: StageProps) =>
        isLink &&
        `
        cursor: pointer;
    `}
`;

const RedFlags = styled.div`
    display: inline-block;
    padding: 2px 10px;
    background: ${({ count }: RedFlagsProps) => (count > 0 ? "#fee2e2" : "#E5E7EB")};
    border-radius: 24px;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: ${({ count }: RedFlagsProps) => (count > 0 ? "#b91c1c" : "#6B7280")};
`;

type DividerProps = {
    isCompleted: boolean;
};

type RedFlagsProps = {
    count: number;
};

type StageProps = {
    isLast: boolean;
    width: number;
    isLink?: boolean;
};

type Props = {
    stage: string;
    interviewDate: string;
    interviews: Interview[];
};

const InterviewStage = ({ stage, interviewDate, interviews }: Props) => {
    const history = useHistory();

    const reportAvailable = (interview: Interview) => {
        return interview.status === InterviewStatus.COMPLETED || interview.status === InterviewStatus.SUBMITTED;
    };

    const onInterviewerClicked = (interview: Interview) => {
        if (reportAvailable(interview)) {
            history.push(routeInterviewReport(interview.interviewId));
        }
    };

    const hasInterviewCompleted = (interviews: Interview[]) => {
        if (!interviews || !interviews[0].interviewDateTime) {
            return false;
        }

        const currentDate = new Date();
        const interviewStartDate = parseDateISO(interviews[0].interviewDateTime) ?? currentDate;
        const interviewEndDate = parseDateISO(interviews[0].interviewEndDateTime) ?? addHours(interviewStartDate, 1);

        return interviewEndDate < currentDate;
    };

    return (
        <>
            <Header>
                {hasInterviewCompleted(interviews) ? (
                    <CheckCircle size={32} color='#16A34A' />
                ) : (
                    <CalendarDays size={32} color='#F59E0B' />
                )}
                <StageName>{stage ?? "Interview"}</StageName>
                <InterviewDate>
                    <CalendarDays size={20} style={{ marginRight: 5 }} />
                    {getFormattedDateShort(interviewDate)}
                </InterviewDate>
            </Header>
            <Stage>
                <Divider isCompleted={hasInterviewCompleted(interviews)} />
                <InterviewsSection>
                    <InterviewsTable>
                        <thead>
                            <tr>
                                <InterviewHeader>Interviewer</InterviewHeader>
                                <InterviewHeader>Score</InterviewHeader>
                                <InterviewHeader>Red flags</InterviewHeader>
                                <InterviewHeader>Decision</InterviewHeader>
                                <InterviewHeader></InterviewHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {interviews.map((interview, index) => (
                                <tr key={interview.interviewId} onClick={() => onInterviewerClicked(interview)}>
                                    <InterviewCell
                                        isLink={reportAvailable(interview)}
                                        width={50}
                                        isLast={interviews.length === index + 1}
                                    >
                                        <InitialsAvatar interviewerName={interview.interviewerName} />{" "}
                                        {interview.interviewerName}
                                    </InterviewCell>
                                    <InterviewCell
                                        isLink={reportAvailable(interview)}
                                        width={15}
                                        isLast={interviews.length === index + 1}
                                    >
                                        <InterviewScoreTag interview={interview as InterviewData} />
                                    </InterviewCell>
                                    <InterviewCell
                                        isLink={reportAvailable(interview)}
                                        width={15}
                                        isLast={interviews.length === index + 1}
                                    >
                                        <RedFlags count={interview.redFlags?.length ?? 0}>
                                            {interview.redFlags?.length ?? 0}
                                        </RedFlags>
                                    </InterviewCell>
                                    <InterviewCell
                                        isLink={reportAvailable(interview)}
                                        width={15}
                                        isLast={interviews.length === index + 1}
                                    >
                                        <InterviewDecisionTag decision={interview.decision} />
                                    </InterviewCell>
                                    <InterviewCell
                                        isLink={reportAvailable(interview)}
                                        width={5}
                                        isLast={interviews.length === index + 1}
                                    >
                                        {reportAvailable(interview) && <ChevronRight />}
                                    </InterviewCell>
                                </tr>
                            ))}
                        </tbody>
                    </InterviewsTable>
                </InterviewsSection>
            </Stage>
        </>
    );
};

export default InterviewStage;
