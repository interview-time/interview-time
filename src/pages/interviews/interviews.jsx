import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { deleteInterview, loadInterviews } from "../../store/interviews/actions";
import styles from "../interviews/interviews.module.css";
import commonStyles from "../../components/layout/common.module.css";
import { Button, Col, Dropdown, Input, Menu, Modal, Row, Space, Table } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { orderBy } from "lodash/collection";
import { DATE_FORMAT_DISPLAY, Status } from "../../components/utils/constants";
import { localeCompare } from "../../components/utils/comparators";
import { routeInterviewDetails, routeInterviewReport, routeInterviewScorecard } from "../../components/utils/route";
import Title from "antd/lib/typography/Title";
import DemoTag from "../../components/demo/demo-tag";
import Text from "antd/lib/typography/Text";
import { getFormattedDate, orderByInterviewDate } from "../../components/utils/utils";
import { defaultTo } from "lodash/util";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import { ArchiveIcon, CalendarIcon, IdeaIcon, MoreIcon } from "../../components/utils/icons";

const { Search } = Input;

/**
 *
 * @param {UserProfile} profile
 * @param {Interview[]} interviewsData
 * @param {boolean} interviewsLoading
 * @param loadInterviews
 * @param deleteInterview
 * @returns {JSX.Element}
 * @constructor
 */
const Interviews = ({
    profile,
    interviewsData,
    interviewsLoading,
    loadInterviews,
    deleteInterview
}) => {
    const history = useHistory();
    const [interviews, setInterviews] = useState([]);

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setInterviews(interviewsData);
        // eslint-disable-next-line
    }, [interviewsData]);

    const onRowClicked = (interview) => {
        if (interview.status === Status.SUBMITTED || interview.userId !== profile.userId) {
            history.push(routeInterviewReport(interview.interviewId));
        } else {
            history.push(routeInterviewScorecard(interview.interviewId));
        }
    };

    const onSearchTextChanged = (e) => {
        onSearchClicked(e.target.value);
    };

    const onSearchClicked = (text) => {
        let lowerCaseText = text.toLocaleLowerCase();
        setInterviews(
            interviewsData.filter((item) =>
                item.candidate.toLocaleLowerCase().includes(lowerCaseText) ||
                item.position.toLocaleLowerCase().includes(lowerCaseText) ||
                item.interviewDateTime !== null
                    ? moment(item.interviewDateTime)
                        .format(DATE_FORMAT_DISPLAY)
                        .toLocaleLowerCase()
                        .includes(lowerCaseText)
                    : false
            )
        );
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

    const createMenu = (interview) => (
        <Menu>
            {(interview.status !== Status.SUBMITTED && interview.status !== Status.COMPLETED)
                && <Menu.Item onClick={e => {
                    e.domEvent.stopPropagation()
                    history.push(routeInterviewDetails(interview.interviewId));
                }}>Edit</Menu.Item>}
            <Menu.Item danger onClick={e => {
                e.domEvent.stopPropagation()
                showDeleteDialog(interview)
            }}>Delete</Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: <Text className={commonStyles.tableHeader}>CANDIDATE</Text>,
            key: "candidate",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidate, b.candidate),
            render: (interview) => {
                return (
                    <>
                        <Text className={`${styles.rowText} fs-mask`}>
                            {interview.candidate}
                        </Text>
                        <DemoTag isDemo={interview.isDemo} />
                    </>
                );
            },
        },
        {
            title: <Text className={commonStyles.tableHeader}>INTERVIEW</Text>,
            key: "position",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.position, b.position),
            render: (interview) => (
                <Text className={`${styles.rowText} fs-mask`}>
                    {defaultTo(interview.position, "-")}
                </Text>
            ),
        },
        {
            title: <Text className={commonStyles.tableHeader}>START DATE</Text>,
            key: "interviewDateTime",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.interviewDateTime, b.interviewDateTime),
            render: (interview) => (
                <Text className={`${styles.rowText} fs-mask`}>
                    {getFormattedDate(interview.interviewDateTime, "-")}
                </Text>
            ),
        },
        {
            title: <Text className={commonStyles.tableHeader}>STATUS</Text>,
            key: "status",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.status, b.status),
            render: (interview) => <InterviewStatusTag interview={interview} />
        },
        {
            key: "actions",
            render: (interview) => <Dropdown overlay={createMenu(interview)} placement="bottomLeft">
                <Button
                    icon={<MoreIcon />}
                    style={{ width: 36, height: 36 }}
                    onClick={e => e.stopPropagation()}
                />
            </Dropdown>
        },
    ];

    const interviewStarted = (interview) => moment() > moment(interview.interviewDateTime);

    const getNewInterviews = () => interviews.filter(interview =>
        interview.status === Status.NEW && !interviewStarted(interview)
    ).length

    const getInProgressInterviews = () => interviews.filter(interview =>
        (interview.status === Status.NEW || interview.status === Status.COMPLETED) && interviewStarted(interview)
    ).length

    const getCompletedInterviews = () => interviews.filter(interview => interview.status === Status.SUBMITTED).length

    return (
        <Layout contentStyle={styles.rootContainer}>
            <div>
                <Title level={4} style={{ marginBottom: 20 }}>Interviews</Title>

                <Row gutter={32} style={{ marginBottom: 32 }}>
                    <Col span={8}>
                        <div className={commonStyles.card}>
                            <Space size={24}>
                                <div className={styles.iconHolder}>
                                    <CalendarIcon />
                                </div>
                                <div>
                                    <Title level={5} style={{ marginBottom: 0 }}>{getNewInterviews()}</Title>
                                    <Text className={styles.label}>Upcoming</Text>
                                </div>
                            </Space>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className={commonStyles.card}>
                            <Space size={24}>
                                <div className={styles.iconHolder}>
                                    <IdeaIcon />
                                </div>
                                <div>
                                    <Title level={5} style={{ marginBottom: 0 }}>{getInProgressInterviews()}</Title>
                                    <Text className={styles.label}>In-progress</Text>
                                </div>
                            </Space>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className={commonStyles.card}>
                            <Space size={24}>
                                <div className={styles.iconHolder}>
                                    <ArchiveIcon />
                                </div>
                                <div>
                                    <Title level={5}
                                           style={{ marginBottom: 0 }}>{getCompletedInterviews()}</Title>
                                    <Text className={styles.label}>Completed</Text>
                                </div>
                            </Space>
                        </div>
                    </Col>
                </Row>

                <div className={styles.divRight}>
                    <Search
                        placeholder="Search"
                        key="search"
                        className={styles.headerSearch}
                        allowClear
                        onSearch={onSearchClicked}
                        onChange={onSearchTextChanged}
                    />
                </div>

                <div className={commonStyles.card} style={{ padding: 0 }}>
                    <Table
                        pagination={false}
                        scroll={{
                            x: "max-content",
                        }}
                        columns={columns}
                        dataSource={interviews}
                        loading={interviewsLoading}
                        rowClassName={styles.row}
                        onRow={(record) => ({
                            onClick: () => onRowClicked(record),
                        })}
                    />
                </div>
            </div>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, deleteInterview };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const profileState = state.user || {};

    return {
        interviewsData: orderBy(interviewsState.interviews, orderByInterviewDate, ["desc"]),
        interviewsLoading: interviewsState.loading,
        profile: profileState.profile
    };
};

export default connect(mapState, mapDispatch)(Interviews);
