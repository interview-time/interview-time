import React from "react";
import Layout from "../../components/layout/layout";
import { deleteInterview, loadInterviews } from "../../store/interviews/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import { Status } from "../../components/utils/constants";
import Title from "antd/lib/typography/Title";
import { ArchiveIcon, CalendarIcon, IdeaIcon } from "../../components/utils/icons";
import { loadTeamMembers } from "../../store/user/actions";
import CardHero from "../../components/card/card-hero";
import InterviewsTable from "./interviews-table";
import ReportsTable from "./reports-table";
import { selectCompletedInterviews, selectUncompletedInterviews } from "../../store/interviews/selector";
import styles from "../interviews/interviews.module.css";

const iconStyle = { fontSize: 24, color: "#8C2BE3" };

/**
 *
 * @param {UserProfile} profile
 * @param uncompletedInterviews
 * @param completedInterviews
 * @param {boolean} interviewsLoading
 * @param loadInterviews
 * @param loadTeamMembers
 * @param deleteInterview
 * @returns {JSX.Element}
 * @constructor
 */
const Interviews = ({
    profile,
    uncompletedInterviews,
    completedInterviews,
    interviewsLoading,
    loadInterviews,
    loadCandidates,
    loadTeamMembers,
    deleteInterview,
}) => {
    React.useEffect(() => {
        loadInterviews();
        loadCandidates();
        loadTeamMembers(profile.currentTeamId);
        // eslint-disable-next-line
    }, []);

    const getNewInterviews = () =>
        uncompletedInterviews.filter(
            interview => interview.status === Status.NEW && interview.interviewStartDateTime > new Date()
        ).length;

    const getInProgressInterviews = () =>
        uncompletedInterviews.filter(
            interview =>
                (interview.status === Status.NEW || interview.status === Status.COMPLETED) &&
                interview.interviewStartDateTime < new Date()
        ).length;

    return (
        <Layout contentStyle={styles.rootContainer}>
            <div>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Interviews
                </Title>

                <Row gutter={[32, 32]} style={{ marginBottom: 32 }}>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            icon={<CalendarIcon style={iconStyle} />}
                            title={getNewInterviews()}
                            text='Upcoming'
                        />
                    </Col>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            icon={<IdeaIcon style={iconStyle} />}
                            title={getInProgressInterviews()}
                            text='In-progress'
                        />
                    </Col>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            icon={<ArchiveIcon style={iconStyle} />}
                            title={completedInterviews.length}
                            text='Completed'
                        />
                    </Col>
                </Row>

                <InterviewsTable
                    interviews={uncompletedInterviews}
                    profile={profile}
                    loading={interviewsLoading}
                    deleteInterview={deleteInterview}
                />

                <ReportsTable interviews={completedInterviews} loading={interviewsLoading} />
            </div>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, deleteInterview, loadTeamMembers, loadCandidates };
const mapState = state => {
    const interviewsState = state.interviews || {};
    const userState = state.user || {};

    return {
        uncompletedInterviews: selectUncompletedInterviews(state),
        completedInterviews: selectCompletedInterviews(state),
        interviewsLoading: interviewsState.loading,
        profile: userState.profile,
    };
};

export default connect(mapState, mapDispatch)(Interviews);
