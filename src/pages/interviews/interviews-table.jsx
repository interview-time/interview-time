import { Button, ConfigProvider, Dropdown, Menu, Modal, Space, Table, Select } from "antd";
import Title from "antd/lib/typography/Title";
import Card from "../../components/card/card";
import React, { useState } from "react";
import TableHeader from "../../components/table/table-header";
import { localeCompare } from "../../components/utils/comparators";
import TableText from "../../components/table/table-text";
import DemoTag from "../../components/demo/demo-tag";
import { defaultTo } from "lodash/util";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import { MoreIcon } from "../../components/utils/icons";
import { Status } from "../../components/utils/constants";
import { routeInterviewDetails, routeInterviewReport, routeInterviewScorecard } from "../../components/utils/route";
import { useHistory } from "react-router-dom";
import emptyInterview from "../../assets/empty-interview.svg";
import Text from "antd/lib/typography/Text";
import { sortBy } from "lodash/collection";
import { truncate } from "lodash/string";
import { uniqBy } from "lodash/array";
import { filterOptionLabel, interviewsPositionOptions } from "../../components/utils/filters";
import styles from "../interviews/interviews.module.css";
import { getFormattedDateTime } from "../../components/utils/date-fns";

/**
 *
 * @param {Interview[]} interviews
 * @param {UserProfile} profile
 * @param {boolean} loading
 * @param deleteInterview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewsTable = ({ profile, interviews, loading, deleteInterview, showFilter = true }) => {
    const history = useHistory();
    const [interviewers, setInterviewers] = useState([]);
    const [interviewsData, setInterviews] = useState([]);

    const [filter, setFilter] = useState({
        interviewer: null,
        position: null,
    });

    React.useEffect(() => {
        setInterviews(interviews);

        let profileName =
            truncate(profile.name, {
                length: 18,
            }) + " (You)";

        setInterviewers(
            [
                {
                    label: profileName,
                    value: profile.userId,
                },
            ].concat(
                sortBy(
                    uniqBy(interviews, interview => interview.interviewerId)
                        .filter(interview => interview.interviewerId && interview.interviewerId !== profile.userId)
                        .map(interview => ({
                            label: interview.interviewerName,
                            value: interview.interviewerId,
                        })),
                    [item => item.label]
                )
            )
        );
        // eslint-disable-next-line
    }, [interviews]);

    React.useEffect(() => {
        let filteredInterviews = interviews;

        if (filter.interviewer) {
            filteredInterviews = filteredInterviews.filter(interview => interview.interviewerId === filter.interviewer);
        }

        if (filter.position) {
            filteredInterviews = filteredInterviews.filter(
                interview => interview.position && interview.position.includes(filter.position)
            );
        }

        setInterviews(filteredInterviews);

        // eslint-disable-next-line
    }, [filter]);

    const onPositionFilterClear = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            position: null,
        }));
    };

    const onPositionFilterChange = value => {
        setFilter(prevFilter => ({
            ...prevFilter,
            position: value,
        }));
    };

    const onInterviewerFilterClear = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            interviewer: null,
        }));
    };

    const onInterviewerFilterChange = value => {
        setFilter(prevFilter => ({
            ...prevFilter,
            interviewer: value,
        }));
    };

    const onRowClicked = interview => {
        if (interview.status === Status.SUBMITTED || interview.interviewerId !== profile.userId) {
            history.push(routeInterviewReport(interview.interviewId));
        } else {
            history.push(routeInterviewScorecard(interview.interviewId));
        }
    };

    const showDeleteDialog = (id, candidateName) => {
        Modal.confirm({
            title: "Delete Interview",
            content: `Are you sure you want to delete interview with '${candidateName}' ?`,
            okText: "Yes",
            cancelText: "No",
            onOk() {
                deleteInterview(id);
            },
        });
    };

    const createMenu = (id, status, candidateName) => (
        <Menu>
            {status !== Status.SUBMITTED && status !== Status.COMPLETED && (
                <Menu.Item
                    onClick={e => {
                        e.domEvent.stopPropagation();
                        history.push(routeInterviewDetails(id));
                    }}
                >
                    Edit
                </Menu.Item>
            )}
            <Menu.Item
                danger
                onClick={e => {
                    e.domEvent.stopPropagation();
                    showDeleteDialog(id, candidateName);
                }}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: <TableHeader>CANDIDATE</TableHeader>,
            key: "candidateName",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidateName, b.candidateName),
            render: interview => {
                return (
                    <>
                        <TableText className={`fs-mask`}>{interview.candidateName}</TableText>
                        <DemoTag isDemo={interview.isDemo} />
                    </>
                );
            },
        },
        {
            title: <TableHeader>INTERVIEW</TableHeader>,
            key: "position",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.position, b.position),
            render: interview => <TableText>{defaultTo(interview.position, "")}</TableText>,
        },
        {
            title: <TableHeader>DATE</TableHeader>,
            key: "interviewStartDateTimeDisplay",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => a.interviewStartDateTimeDisplay - b.interviewStartDateTimeDisplay,
            render: interview => <TableText>{getFormattedDateTime(interview.interviewStartDateTimeDisplay)}</TableText>,
        },
        {
            title: <TableHeader>INTERVIEWER</TableHeader>,
            key: "interviewerName",
            sortDirections: ["descend", "ascend"],
            width: 200,
            sorter: (a, b) => localeCompare(a.interviewerName, b.interviewerName),
            render: interview => {
                return (
                    <TableText>
                        {interview.interviewerName
                            ? truncate(interview.interviewerName, {
                                  length: 20,
                              })
                            : "-"}
                    </TableText>
                );
            },
        },
        {
            title: <TableHeader>STATUS</TableHeader>,
            key: "status",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.status, b.status),
            render: interview => (
                <InterviewStatusTag
                    interviewStartDateTime={interview.interviewStartDateTime}
                    status={interview.status}
                />
            ),
        },
        {
            key: "actions",
            render: interview => (
                <Dropdown
                    overlay={createMenu(interview.interviewId, interview.status, interview.candidate)}
                    placement='bottomLeft'
                >
                    <Button icon={<MoreIcon />} style={{ width: 36, height: 36 }} onClick={e => e.stopPropagation()} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            {showFilter && (
                <div className={styles.filterSection}>
                    <Title level={5} style={{ marginBottom: 20 }}>
                        Current
                    </Title>

                    <div className={styles.divRight}>
                        <Select
                            className={styles.select}
                            placeholder='Interviewer filter'
                            onSelect={onInterviewerFilterChange}
                            onClear={onInterviewerFilterClear}
                            options={interviewers}
                            showSearch
                            allowClear
                            filterOption={filterOptionLabel}
                        />
                        <Select
                            className={styles.select}
                            placeholder='Position filter'
                            onSelect={onPositionFilterChange}
                            onClear={onPositionFilterClear}
                            options={interviewsPositionOptions(interviewsData)}
                            showSearch
                            allowClear
                            filterOption={filterOptionLabel}
                        />
                    </div>
                </div>
            )}
            
            <Card withPadding={false}>
                <ConfigProvider
                    renderEmpty={() => (
                        <Space direction='vertical' style={{ padding: 24 }}>
                            <img src={emptyInterview} alt='No interviews' />
                            <Text style={{ color: "#6B7280" }}>You currently don’t have any interviews.</Text>
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

export default InterviewsTable;
