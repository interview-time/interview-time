import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ConfigProvider, Input, Select, Space, Table } from "antd";
import Text from "antd/lib/typography/Text";
import { getDecisionText } from "../../utils/assessment";
import { routeCandidateDetails, routeInterviewReport } from "../../utils/route";
import Title from "antd/lib/typography/Title";
import { filterOptionLabel, interviewsPositionOptions } from "../../utils/filters";
import Card from "../../components/card/card";
import TableHeader from "../../components/table/table-header";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import InterviewScoreTag from "../../components/tags/interview-score-tags";
import InterviewCompetenceTag from "../../components/tags/interview-competence-tags";
import emptyInterview from "../../assets/empty-interview.svg";
import styles from "./reports-table.module.css";
import { getFormattedDateTime } from "../../utils/date-fns";
import InitialsAvatar from "../../components/avatar/initials-avatar";
import { CandidateColumn, DateColumn, InterviewColumn } from "../../components/table/table-interviews";

const { Search } = Input;

const ReportsTable = ({ interviews, loading }) => {
    const history = useHistory();
    const [interviewsData, setInterviews] = useState([]);
    const [position, setPosition] = useState();

    React.useEffect(() => {
        setInterviews(interviews);
        // eslint-disable-next-line
    }, [interviews]);

    React.useEffect(() => {
        if (position) {
            let lowerCaseText = position.toLocaleLowerCase();
            setInterviews(
                interviews.filter(
                    interview => interview.position && interview.position.toLocaleLowerCase().includes(lowerCaseText)
                )
            );
        } else if (position === null) {
            setInterviews(interviews);
        }
        // eslint-disable-next-line
    }, [position]);

    const onCandidateClicked = (e, candidateId) => {
        e.stopPropagation(); // prevent opening report
        history.push(routeCandidateDetails(candidateId));
    };

    const onRowClicked = interview => {
        history.push(routeInterviewReport(interview.interviewId));
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase();
        setInterviews(
            interviews.filter(
                item =>
                    item.candidateName?.toLocaleLowerCase()?.includes(lowerCaseText) ||
                    item.position?.toLocaleLowerCase()?.includes(lowerCaseText) ||
                    getFormattedDateTime(item.interviewStartDateTime).toLocaleLowerCase().includes(lowerCaseText) ||
                    getDecisionText(item.decision).toLocaleLowerCase().includes(lowerCaseText)
            )
        );
    };

    const columns = [
        CandidateColumn(onCandidateClicked),
        InterviewColumn(),
        DateColumn(),
        {
            title: <TableHeader>INTERVIEWER</TableHeader>,
            key: "interviewerName",
            dataIndex: "interviewerName",
            render: interviewerName => <InitialsAvatar interviewerName={interviewerName} />,
        },
        {
            title: <TableHeader>SCORE</TableHeader>,
            key: "score",
            render: interview => <InterviewScoreTag interview={interview} />,
        },
        {
            title: <TableHeader>COMPETENCE</TableHeader>,
            key: "status",
            render: interview => <InterviewCompetenceTag interview={interview} max={4} />,
        },
        {
            title: <TableHeader>DECISION</TableHeader>,
            key: "decision",
            dataIndex: "decision",
            render: decision => <InterviewDecisionTag decision={decision} />,
        },
    ];

    return (
        <div className={styles.component}>
            <div className={styles.filterSection}>
                <Title level={5} style={{ marginBottom: 20 }}>
                    Completed
                </Title>

                {interviews.length > 5 && (
                    <div className={styles.divRight}>
                        <Search
                            placeholder='Search'
                            key='search'
                            className={styles.headerSearch}
                            allowClear
                            onSearch={onSearchClicked}
                            onChange={e => onSearchClicked(e.target.value)}
                        />
                        <Select
                            className={styles.select}
                            placeholder='Position'
                            onSelect={value => setPosition(value)}
                            onClear={() => setPosition(null)}
                            options={interviewsPositionOptions(interviews)}
                            showSearch
                            allowClear
                            filterOption={filterOptionLabel}
                        />
                    </div>
                )}
            </div>

            <Card withPadding={false}>
                <ConfigProvider
                    renderEmpty={() => (
                        <Space direction='vertical' style={{ padding: 24 }}>
                            <img src={emptyInterview} alt='No interviews' />
                            <Text style={{ color: "#6B7280" }}>You currently don’t have any completed interviews</Text>
                        </Space>
                    )}
                >
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
                        dataSource={interviewsData}
                        loading={loading}
                        rowClassName={styles.row}
                        onRow={record => ({
                            onClick: () => onRowClicked(record),
                        })}
                    />
                </ConfigProvider>
            </Card>
        </div>
    );
};

export default ReportsTable;
