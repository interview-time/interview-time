import { Button, ConfigProvider, Dropdown, Menu, Modal, Select, Space, Table } from "antd";
import Title from "antd/lib/typography/Title";
import Card from "../../components/card/card";
import React, { useState } from "react";
import { MoreIcon } from "../../utils/icons";
import { Status } from "../../utils/constants";
import { routeInterviewDetails, routeInterviewScorecard } from "../../utils/route";
import { useHistory } from "react-router-dom";
import emptyInterview from "../../assets/empty-interview.svg";
import Text from "antd/lib/typography/Text";
import { filterOptionLabel, interviewsPositionOptions } from "../../utils/filters";
import styles from "../interviews/interviews.module.css";
import {
    CandidateColumn,
    DateColumn,
    InterviewColumn,
    InterviewerColumn,
    StatusColumn,
} from "../../components/table/table-interviews";
import { getCandidateName, InterviewData } from "../../store/interviews/selector";
import { ColumnsType } from "antd/lib/table/interface";
import { sortBy, truncate, uniqBy } from "lodash";
import { TeamRole, UserProfile } from "../../store/models";

type Props = {
    interviews: InterviewData[];
    userRole: TeamRole;
    profile: UserProfile;
    loading: boolean;
    showFilter?: boolean;
    deleteInterview: any;
};

type SelectOption = {
    label: string;
    value: string;
};

type Filter = {
    interviewerId: string | null;
    position: string | null;
};

const InterviewsTable = ({ profile, userRole, interviews, loading, deleteInterview, showFilter = true }: Props) => {
    const history = useHistory();
    const [interviewsData, setInterviews] = useState<InterviewData[]>([]);
    const [interviewers, setInterviewers] = useState<SelectOption[]>([]);

    const [filter, setFilter] = useState<Filter>({
        interviewerId: null,
        position: null,
    });

    React.useEffect(() => {
        updateInterviews();

        let profileName =
            truncate(profile.name, {
                length: 18,
            }) + " (You)";
        let interviewers = uniqBy(interviews, (interview: InterviewData) => interview.userId)
            .filter(
                (interview: InterviewData) =>
                    interview.interviewerMember && interview.interviewerMember.userId !== profile.userId
            )
            .map((interview: InterviewData) => {
                const member = interview.interviewerMember!!;
                return {
                    label: member.name,
                    value: member.userId,
                };
            });

        setInterviewers(
            [
                {
                    label: profileName,
                    value: profile.userId,
                },
            ].concat(sortBy(interviewers, [(item: SelectOption) => item.value]))
        );
        // eslint-disable-next-line
    }, [interviews]);

    React.useEffect(() => {
        updateInterviews();
        // eslint-disable-next-line
    }, [filter]);

    const isInterviewer = () => userRole === TeamRole.INTERVIEWER;

    const updateInterviews = () => {
        let filteredInterviews = interviews;

        if (filter.interviewerId) {
            filteredInterviews = filteredInterviews.filter(interview => interview.userId === filter.interviewerId);
        }

        if (filter.position) {
            filteredInterviews = filteredInterviews.filter(interview => interview.position === filter.position);
        }

        setInterviews(filteredInterviews);
    };

    const onPositionFilterClear = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            position: null,
        }));
    };

    const onPositionFilterChange = (value: string) => {
        setFilter(prevFilter => ({
            ...prevFilter,
            position: value,
        }));
    };

    const onInterviewerFilterClear = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            interviewerId: null,
        }));
    };

    const onInterviewerFilterChange = (value: string) => {
        setFilter(prevFilter => ({
            ...prevFilter,
            interviewerId: value,
        }));
    };

    const onRowClicked = (interview: InterviewData) => {
        history.push(routeInterviewScorecard(interview.interviewId));
    };

    const showDeleteDialog = (id: string, candidateName?: string) => {
        let message =
            "Are you sure you want to delete interview " + (candidateName ? `with '${candidateName}' ?` : "?");
        Modal.confirm({
            title: "Delete Interview",
            content: message,
            okText: "Yes",
            cancelText: "No",
            onOk() {
                deleteInterview(id);
            },
        });
    };

    const createMenu = (id: string, status: string, candidateName?: string) => (
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

    const columns: ColumnsType<InterviewData> = [
        CandidateColumn(!isInterviewer()),
        InterviewColumn(profile.userId, !isInterviewer()),
        DateColumn(),
        InterviewerColumn(),
        StatusColumn(),
        {
            key: "actions",
            render: (interview: InterviewData) => (
                // @ts-ignore
                <Dropdown
                    overlay={createMenu(interview.interviewId, interview.status, getCandidateName(interview))}
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
                        rowClassName={isInterviewer() ? styles.row : undefined}
                        onRow={record => ({
                            onClick: () => {
                                if (isInterviewer()) {
                                    onRowClicked(record);
                                }
                            },
                        })}
                    />
                </ConfigProvider>
            </Card>
        </div>
    );
};

export default InterviewsTable;