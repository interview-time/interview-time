import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Input, Select, Table, ConfigProvider, Space } from "antd";
import Text from "antd/lib/typography/Text";
import { getDecisionText, getOverallPerformancePercent } from "../../components/utils/assessment";
import { localeCompare } from "../../components/utils/comparators";
import { routeInterviewReport } from "../../components/utils/route";
import Title from "antd/lib/typography/Title";
import { filterOptionLabel, interviewsPositionOptions } from "../../components/utils/filters";
import Card from "../../components/card/card";
import TableHeader from "../../components/table/table-header";
import TableText from "../../components/table/table-text";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import InterviewScoreTag from "../../components/tags/interview-score-tags";
import InterviewCompetenceTag from "../../components/tags/interview-competence-tags";
import { defaultTo } from "lodash/util";
import emptyInterview from "../../assets/empty-interview.svg";
import styles from "./reports-table.module.css";
import { getFormattedDateTime } from "../../components/utils/date-fns";

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
        {
            title: <TableHeader>CANDIDATE</TableHeader>,
            key: "candidateName",
            dataIndex: "candidateName",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidateName, b.candidateName),
            render: candidate => {
                return <TableText className='fs-mask'>{candidate}</TableText>;
            },
        },
        {
            title: <TableHeader>INTERVIEW</TableHeader>,
            key: "position",
            dataIndex: "position",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.position, b.position),
            render: position => {
                return <TableText>{defaultTo(position, "-")}</TableText>;
            },
        },
        {
            title: <TableHeader>DATE</TableHeader>,
            key: "interviewStartDateTimeDisplay",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.interviewStartDateTimeDisplay - b.interviewStartDateTimeDisplay,
            render: interview => <TableText>{getFormattedDateTime(interview.interviewStartDateTimeDisplay)}</TableText>,
        },
        {
            title: <TableHeader>SCORE</TableHeader>,
            key: "position",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) =>
                getOverallPerformancePercent(a.structure.groups) - getOverallPerformancePercent(b.structure.groups),
            render: interview => <InterviewScoreTag interview={interview} />,
        },
        {
            title: <TableHeader>COMPETENCE</TableHeader>,
            key: "status",
            render: interview => <InterviewCompetenceTag interview={interview} />,
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
                            onClick: () => history.push(routeInterviewReport(record.id)),
                        })}
                    />
                </ConfigProvider>
            </Card>
        </div>
    );
};

export default ReportsTable;
