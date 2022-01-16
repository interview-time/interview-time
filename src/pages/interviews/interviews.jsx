import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { deleteInterview, loadInterviews } from "../../store/interviews/actions";
import styles from "../interviews/interviews.module.css";
import { Button, Col, Dropdown, Input, Menu, Modal, Row, Space, Table } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { orderBy } from "lodash/collection";
import { DATE_FORMAT_DISPLAY, Status } from "../../components/utils/constants";
import { localeCompare } from "../../components/utils/comparators";
import { routeInterviewDetails, routeInterviewReport, routeInterviewScorecard } from "../../components/utils/route";
import Title from "antd/lib/typography/Title";
import DemoTag from "../../components/demo/demo-tag";
import { getFormattedDate, orderByInterviewDate } from "../../components/utils/utils";
import { defaultTo } from "lodash/util";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import { ArchiveIcon, CalendarIcon, IdeaIcon, MoreIcon } from "../../components/utils/icons";
import Card from "../../components/card/card";
import TableHeader from "../../components/table/table-header";
import { loadTeamMembers } from "../../store/user/actions";
import { truncate } from "lodash/string";
import TableText from "../../components/table/table-text";
import CardHero from "../../components/card/card-hero";

const { Search } = Input;

const iconStyle = { fontSize: 24, color: '#8C2BE3' }

/**
 *
 * @param {UserProfile} profile
 * @param {Team} activeTeam
 * @param {TeamMember[]} teamMembers
 * @param {Interview[]} interviewsData
 * @param {boolean} interviewsLoading
 * @param loadInterviews
 * @param loadTeamMembers
 * @param deleteInterview
 * @returns {JSX.Element}
 * @constructor
 */
const Interviews = ({
    profile,
    activeTeam,
    teamMembers,
    interviewsData,
    interviewsLoading,
    loadInterviews,
    loadTeamMembers,
    deleteInterview
}) => {
    const history = useHistory();
    const [interviews, setInterviews] = useState([]);

    React.useEffect(() => {
        loadInterviews();
        loadTeamMembers(activeTeam.teamId);
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

    const getInterviewerName = (interview) => {
        let teamMember = teamMembers.find(member => member.userId === interview.userId)
        return teamMember ? truncate(teamMember.name, {
            'length': 20
        }) : null;
    }

    const columns = [
        {
            title: <TableHeader>CANDIDATE</TableHeader>,
            key: "candidate",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidate, b.candidate),
            render: (interview) => {
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
            render: (interview) => (
                <TableText className={`fs-mask`}>
                    {defaultTo(interview.position, "-")}
                </TableText>
            ),
        },
        {
            title: <TableHeader>DATE</TableHeader>,
            key: "interviewDateTime",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.interviewDateTime, b.interviewDateTime),
            render: (interview) => (
                <TableText className={`fs-mask`}>
                    {getFormattedDate(interview.interviewDateTime, "-")}
                </TableText>
            ),
        },
        {
            title: <TableHeader>INTERVIEWER</TableHeader>,
            key: "position",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.position, b.position),
            render: (interview) => (
                <TableText className={`fs-mask`}>
                    {getInterviewerName(interview)}
                </TableText>
            ),
        },
        {
            title: <TableHeader>STATUS</TableHeader>,
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
                        <CardHero
                            icon={<CalendarIcon style={iconStyle} />}
                            title={getNewInterviews()}
                            text="Upcoming"
                        />
                    </Col>
                    <Col span={8}>
                        <CardHero
                            icon={<IdeaIcon style={iconStyle} />}
                            title={getInProgressInterviews()}
                            text="In-progress"
                        />
                    </Col>
                    <Col span={8}>
                        <CardHero
                            icon={<ArchiveIcon style={iconStyle} />}
                            title={getCompletedInterviews()}
                            text="Completed"
                        />
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

                <Card withPadding={false}>
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
                </Card>
            </div>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, deleteInterview, loadTeamMembers };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const userState = state.user || {};

    return {
        interviewsData: orderBy(interviewsState.interviews, orderByInterviewDate, ["desc"]),
        interviewsLoading: interviewsState.loading,
        teamMembers: userState.teamMembers || [],
        profile: userState.profile,
        activeTeam: userState.activeTeam
    };
};

export default connect(mapState, mapDispatch)(Interviews);
