import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import { deleteInterview, loadInterviews } from "../../store/interviews/actions";
import styles from "../interviews/interviews.module.css";
import { Col, Row, Select } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { orderBy, sortBy } from "lodash/collection";
import { Status } from "../../components/utils/constants";
import Title from "antd/lib/typography/Title";
import { orderByInterviewDate } from "../../components/utils/date";
import { ArchiveIcon, CalendarIcon, IdeaIcon } from "../../components/utils/icons";
import { loadTeamMembers } from "../../store/user/actions";
import { truncate } from "lodash/string";
import CardHero from "../../components/card/card-hero";
import { uniqBy } from "lodash/array";
import { filterOptionLabel, interviewsPositionOptions } from "../../components/utils/filters";
import InterviewsTable from "./interviews-table";

const iconStyle = { fontSize: 24, color: "#8C2BE3" };

/**
 *
 * @param {UserProfile} profile
 * @param {Team} activeTeam
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
    interviewsData,
    interviewsLoading,
    loadInterviews,
    loadTeamMembers,
    deleteInterview,
}) => {
    const [interviews, setInterviews] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [filter, setFilter] = useState({
        interviewer: null,
        position: null,
    });

    React.useEffect(() => {
        loadInterviews();
        loadTeamMembers(activeTeam.teamId);
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setInterviews(interviewsData);

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
                    uniqBy(interviewsData, interview => interview.userId)
                        .filter(interview => interview.userId !== profile.userId)
                        .map(interview => ({
                            label: interview.userName,
                            value: interview.userId,
                        })),
                    [item => item.label]
                )
            )
        );
        // eslint-disable-next-line
    }, [interviewsData]);

    React.useEffect(() => {
        let filteredInterviews = interviewsData;

        if (filter.interviewer) {
            filteredInterviews = filteredInterviews.filter(interview => interview.userId === filter.interviewer);
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
        setFilter({
            ...filter,
            position: null,
        });
    };

    const onPositionFilterChange = value => {
        setFilter({
            ...filter,
            position: value,
        });
    };

    const onInterviewerFilterClear = () => {
        setFilter({
            ...filter,
            interviewer: null,
        });
    };

    const onInterviewerFilterChange = value => {
        setFilter({
            ...filter,
            interviewer: value,
        });
    };

    const interviewStarted = interview => moment() > moment(interview.interviewDateTime);

    const getNewInterviews = () =>
        interviews.filter(interview => interview.status === Status.NEW && !interviewStarted(interview)).length;

    const getInProgressInterviews = () =>
        interviews.filter(
            interview =>
                (interview.status === Status.NEW || interview.status === Status.COMPLETED) &&
                interviewStarted(interview)
        ).length;

    const getCompletedInterviews = () => interviews.filter(interview => interview.status === Status.SUBMITTED).length;

    return (
        <Layout contentStyle={styles.rootContainer}>
            <div>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Interviews
                </Title>

                <Row gutter={32} style={{ marginBottom: 32 }}>
                    <Col span={8}>
                        <CardHero
                            icon={<CalendarIcon style={iconStyle} />}
                            title={getNewInterviews()}
                            text='Upcoming'
                        />
                    </Col>
                    <Col span={8}>
                        <CardHero
                            icon={<IdeaIcon style={iconStyle} />}
                            title={getInProgressInterviews()}
                            text='In-progress'
                        />
                    </Col>
                    <Col span={8}>
                        <CardHero
                            icon={<ArchiveIcon style={iconStyle} />}
                            title={getCompletedInterviews()}
                            text='Completed'
                        />
                    </Col>
                </Row>

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
                        options={interviewsPositionOptions(interviews)}
                        showSearch
                        allowClear
                        filterOption={filterOptionLabel}
                    />
                </div>

                <InterviewsTable
                    interviews={interviews}
                    profile={profile}
                    loading={interviewsLoading}
                    deleteInterview={deleteInterview}
                />
            </div>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, deleteInterview, loadTeamMembers };
const mapState = state => {
    const interviewsState = state.interviews || {};
    const userState = state.user || {};

    // sort interview by uncompleted first in chronological order
    let completedInterviews = interviewsState.interviews.filter(interview => interview.status === Status.SUBMITTED);
    let uncompletedInterview = interviewsState.interviews.filter(interview => interview.status !== Status.SUBMITTED);
    let sortedInterviews = orderBy(uncompletedInterview, orderByInterviewDate, ["asc"]).concat(
        orderBy(completedInterviews, orderByInterviewDate, ["asc"])
    );
    sortedInterviews.forEach(interview => {
        if (userState.teamMembers) {
            interview.userName =
                userState.teamMembers.find(member => member.userId === interview.userId)?.name || "Unknown user";
        }
    });

    return {
        interviewsData: sortedInterviews,
        interviewsLoading: interviewsState.loading,
        profile: userState.profile,
        activeTeam: userState.activeTeam,
    };
};

export default connect(mapState, mapDispatch)(Interviews);
