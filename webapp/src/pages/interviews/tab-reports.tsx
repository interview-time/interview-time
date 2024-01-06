import { ConfigProvider, Table } from "antd";
import { ColumnsType } from "antd/lib/table/interface";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Card } from "../../assets/styles/global-styles";
import InitialsAvatar from "../../components/avatar/initials-avatar";
import EmptyState from "../../components/empty-state/empty-state";
import TableHeader from "../../components/table/table-header";
import { CandidateColumn, DateColumn, JobColumn } from "../../components/table/table-interviews";
import InterviewCompetenceTag from "../../components/tags/interview-competence-tags";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import InterviewScoreTag from "../../components/tags/interview-score-tags";
import { Interview, TeamMember } from "../../store/models";
import { routeInterviewReport } from "../../utils/route";
import styles from "./tab-reports.module.css";

const TableCard = styled(Card)`
    margin-top: 24px;
`;

interface InterviewTableItem extends Interview {
    interviewer?: TeamMember;
}

type Props = {
    interviews: Interview[];
    teamMembers: TeamMember[];
};

const TabReports = ({ interviews, teamMembers }: Props) => {
    const history = useHistory();
    const tableItems = interviews.map(interview => ({
        ...interview,
        interviewer: teamMembers.find(member => member.userId === interview.userId),
    }));

    const onRowClicked = (interview: InterviewTableItem) => {
        history.push(routeInterviewReport(interview.interviewId));
    };

    const columns: ColumnsType<InterviewTableItem> = [
        CandidateColumn(),
        JobColumn(),
        DateColumn(),
        {
            title: <TableHeader>INTERVIEWER</TableHeader>,
            key: "interviewer",
            render: (interview: InterviewTableItem) => (
                <InitialsAvatar interviewerName={interview?.interviewer?.name ?? "-"} />
            ),
        },
        {
            title: <TableHeader>SCORE</TableHeader>,
            key: "score",
            render: (interview: Interview) => <InterviewScoreTag interview={interview} />,
        },
        {
            title: <TableHeader>COMPETENCE</TableHeader>,
            key: "status",
            render: (interview: Interview) => <InterviewCompetenceTag interview={interview} max={4} />,
        },
        {
            title: <TableHeader>DECISION</TableHeader>,
            key: "decision",
            render: (interview: Interview) => <InterviewDecisionTag decision={interview.decision} />,
        },
    ];

    return (
        <TableCard>
            <ConfigProvider renderEmpty={() => <EmptyState message='You currently don’t have any interviews.' />}>
                <Table
                    pagination={{
                        style: { marginRight: 24 },
                        defaultPageSize: 10,
                        hideOnSinglePage: true,
                    }}
                    scroll={{
                        x: "max-content",
                    }}
                    columns={columns}
                    dataSource={tableItems}
                    rowClassName={styles.row}
                    onRow={record => ({
                        onClick: () => {
                            onRowClicked(record);
                        },
                    })}
                />
            </ConfigProvider>
        </TableCard>
    );
};

export default TabReports;
