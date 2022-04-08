import { Button, ConfigProvider, Dropdown, Menu, Modal, Space, Table } from "antd";
import styles from "../candidate-details/candidate-details.module.css";
import Card from "../../components/card/card";
import React from "react";
import TableHeader from "../../components/table/table-header";
import { localeCompare } from "../../components/utils/comparators";
import TableText from "../../components/table/table-text";
import DemoTag from "../../components/demo/demo-tag";
import { defaultTo } from "lodash/util";
import { getFormattedDateTime } from "../../components/utils/date";
import { truncate } from "lodash/string";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import { MoreIcon } from "../../components/utils/icons";
import { Status } from "../../components/utils/constants";
import { routeInterviewDetails, routeInterviewReport, routeInterviewScorecard } from "../../components/utils/route";
import { useHistory } from "react-router-dom";
import emptyInterview from "../../assets/empty-interview.svg";
import Text from "antd/lib/typography/Text";

/**
 *
 * @param {Interview[]} interviews
 * @param {UserProfile} profile
 * @param {boolean} loading
 * @param deleteInterview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewsTable = ({ profile, interviews, loading, deleteInterview }) => {
    const history = useHistory();

    const onRowClicked = interview => {
        if (interview.status === Status.SUBMITTED || interview.userId !== profile.userId) {
            history.push(routeInterviewReport(interview.interviewId));
        } else {
            history.push(routeInterviewScorecard(interview.interviewId));
        }
    };

    const showDeleteDialog = interview => {
        Modal.confirm({
            title: "Delete Interview",
            content: `Are you sure you want to delete interview with '${interview.candidate}' ?`,
            okText: "Yes",
            cancelText: "No",
            onOk() {
                deleteInterview(interview.interviewId);
            },
        });
    };

    const createMenu = interview => (
        <Menu>
            {interview.status !== Status.SUBMITTED && interview.status !== Status.COMPLETED && (
                <Menu.Item
                    onClick={e => {
                        e.domEvent.stopPropagation();
                        history.push(routeInterviewDetails(interview.interviewId));
                    }}
                >
                    Edit
                </Menu.Item>
            )}
            <Menu.Item
                danger
                onClick={e => {
                    e.domEvent.stopPropagation();
                    showDeleteDialog(interview);
                }}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: <TableHeader>CANDIDATE</TableHeader>,
            key: "candidate",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidate, b.candidate),
            render: interview => {
                return (
                    <>
                        <TableText className={`fs-mask`}>{interview.candidate}</TableText>
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
            render: interview => <TableText>{defaultTo(interview.position, "-")}</TableText>,
        },
        {
            title: <TableHeader>DATE</TableHeader>,
            key: "interviewDateTime",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.interviewDateTime, b.interviewDateTime),
            render: interview => <TableText>{getFormattedDateTime(interview.interviewDateTime, "-")}</TableText>,
        },
        {
            title: <TableHeader>INTERVIEWER</TableHeader>,
            key: "interviewer",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.userName, b.userName),
            render: interview => (
                <TableText className={`fs-mask`}>
                    {truncate(interview.userName, {
                        length: 20,
                    })}
                </TableText>
            ),
        },
        {
            title: <TableHeader>STATUS</TableHeader>,
            key: "status",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.status, b.status),
            render: interview => <InterviewStatusTag interview={interview} />,
        },
        {
            key: "actions",
            render: interview => (
                <Dropdown overlay={createMenu(interview)} placement='bottomLeft'>
                    <Button icon={<MoreIcon />} style={{ width: 36, height: 36 }} onClick={e => e.stopPropagation()} />
                </Dropdown>
            ),
        },
    ];

    return (
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
                        defaultPageSize: 20,
                    }}
                    scroll={{
                        x: "max-content",
                    }}
                    columns={columns}
                    dataSource={interviews}
                    loading={loading}
                    rowClassName={styles.row}
                    onRow={record => ({
                        onClick: () => onRowClicked(record),
                    })}
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>{record.linkId}</p>,
                        rowExpandable: record => record.linkId,
                    }}
                />
            </ConfigProvider>
        </Card>
    );
};

export default InterviewsTable;
