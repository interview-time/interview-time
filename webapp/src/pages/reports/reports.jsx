import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadInterviews } from "../../store/interviews/actions";
import styles from "./reports.module.css";
import { Input, Select, Table } from "antd";
import { connect } from "react-redux";
import { sortBy } from "lodash/collection";
import { getDecisionText, getOverallPerformancePercent } from "../../utils/assessment";
import { localeCompare } from "../../utils/comparators";
import { reverse } from "lodash/array";
import { cloneDeep } from "lodash/lang";
import { routeInterviewReport } from "../../utils/route";
import { Typography } from "antd";
import { filterOptionLabel, interviewsPositionOptions } from "../../utils/filters";
import Card from "../../components/card/card";
import TableHeader from "../../components/table/table-header";
import TableText from "../../components/table/table-text";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import InterviewScoreTag from "../../components/tags/interview-score-tags";
import InterviewCompetenceTag from "../../components/tags/interview-competence-tags";
import { defaultTo } from "lodash/util";
import { getFormattedDateTime } from "../../utils/date-fns";
import { ApiRequestStatus } from "../../store/state-models";
import { InterviewStatus } from "../../store/models";

const { Search } = Input;
const { Title } = Typography;

const Reports = ({ interviews, loading, loadInterviews }) => {
    const history = useHistory();
    const [interviewsData, setInterviews] = useState([]);
    const [position, setPosition] = useState();

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setInterviews(interviews);
        // eslint-disable-next-line
    }, [interviews]);

    React.useEffect(() => {
        if (position) {
            let lowerCaseText = position.toLocaleLowerCase();
            setInterviews(
                interviews.filter(interview => interview.position && interview.position.toLocaleLowerCase().includes(lowerCaseText))
            );
        } else if (position === null) {
            setInterviews(interviews);
        }
        // eslint-disable-next-line
    }, [position]);

    const onRowClicked = record => {
        history.push(routeInterviewReport(record.interviewId));
    };

    const onSearchTextChanged = e => {
        onSearchClicked(e.target.value);
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase();
        setInterviews(
            interviews.filter(
                item =>
                    item.candidate?.toLocaleLowerCase()?.includes(lowerCaseText) ||
                    item.position?.toLocaleLowerCase()?.includes(lowerCaseText) ||
                    getDecisionText(item.decision).toLocaleLowerCase().includes(lowerCaseText)
            )
        );
    };

    const onPositionClear = () => {
        setPosition(null);
    };

    const onPositionChange = value => {
        setPosition(value);
    };

    const columns = [
        {
            title: <TableHeader>CANDIDATE</TableHeader>,
            key: "candidate",
            dataIndex: "candidate",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidate, b.candidate),
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
            key: "interviewDateTime",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.interviewDateTime, b.interviewDateTime),
            render: interview => (
                <TableText>{getFormattedDateTime(interview.interviewDateTime, "-")}</TableText>
            ),
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
        <Layout >
            <div>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Reports
                </Title>

                <div className={styles.divRight}>
                    <Search
                        placeholder='Search'
                        key='search'
                        className={styles.headerSearch}
                        allowClear
                        onSearch={onSearchClicked}
                        onChange={onSearchTextChanged}
                    />
                    <Select
                        className={styles.select}
                        placeholder='Position'
                        onSelect={onPositionChange}
                        onClear={onPositionClear}
                        options={interviewsPositionOptions(interviews)}
                        showSearch
                        allowClear
                        filterOption={filterOptionLabel}
                    />
                </div>

                <Card withPadding={false}>
                    <Table
                        pagination={{
                            style: { marginRight: 24 },
                            defaultPageSize: 20,
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
                </Card>
            </div>
        </Layout>
    );
};

const mapDispatch = { loadInterviews };
const mapState = state => {
    const interviewsState = state.interviews || {};

    const interviews = reverse(
        sortBy(cloneDeep(interviewsState.interviews.filter(interview => interview.status === InterviewStatus.SUBMITTED)), [
            "interviewDateTime",
        ])
    );

    return {
        interviews: interviews,
        loading: state.interviews.apiResults.GetInterviews.status === ApiRequestStatus.InProgress,
    };
};

export default connect(mapState, mapDispatch)(Reports);
