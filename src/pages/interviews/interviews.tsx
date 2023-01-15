import { Col, Row, Typography } from "antd";
import React from "react";
import { connect } from "react-redux";
import CardHero from "../../components/card/card-hero";
import Layout from "../../components/layout/layout";
import { loadCandidates } from "../../store/candidates/actions";
import { deleteInterview, loadInterviews } from "../../store/interviews/actions";
import {
    InterviewData,
    selectCompletedInterviewData,
    selectUncompletedInterviewData,
} from "../../store/interviews/selector";
import { Interview, TeamRole, UserProfile } from "../../store/models";
import { ApiRequestStatus, RootState } from "../../store/state-models";
import { selectUserRole } from "../../store/team/selector";
import { loadTeamMembers } from "../../store/user/actions";
import { Status } from "../../utils/constants";
import { ArchiveIcon, CalendarIcon, IdeaIcon } from "../../utils/icons";
import ScheduleInterviewModal from "../interview-schedule/schedule-interview-modal";
import InterviewsTable from "./interviews-table";
import ReportsTable from "./reports-table";

const { Title } = Typography;

const iconStyle = { fontSize: 24, color: "#8C2BE3" };

type EditInterview = {
    visible: boolean;
    interview?: Interview;
};

type Props = {
    profile: UserProfile;
    userRole: TeamRole;
    uncompletedInterviews: InterviewData[];
    completedInterviews: InterviewData[];
    interviewsLoading: boolean;
    loadInterviews: any;
    loadCandidates: any;
    loadTeamMembers: any;
    deleteInterview: any;
};

const Interviews = ({
    profile,
    userRole,
    uncompletedInterviews,
    completedInterviews,
    interviewsLoading,
    loadInterviews,
    loadCandidates,
    loadTeamMembers,
    deleteInterview,
}: Props) => {
    const [editInterview, setEditInterview] = React.useState<EditInterview>({
        visible: false,
    });

    React.useEffect(() => {
        loadInterviews();
        loadCandidates();
        loadTeamMembers(profile.currentTeamId);
        // eslint-disable-next-line
    }, []);

    const getNewInterviews = () =>
        uncompletedInterviews.filter(
            interview => interview.status === Status.NEW && interview.startDateTime > new Date()
        ).length;

    const getInProgressInterviews = () =>
        uncompletedInterviews.filter(
            interview =>
                (interview.status === Status.NEW || interview.status === Status.COMPLETED) &&
                interview.startDateTime < new Date()
        ).length;

    return (
        // @ts-ignore
        <Layout>
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
                    profile={profile}
                    userRole={userRole}
                    interviews={uncompletedInterviews}
                    loading={interviewsLoading}
                    onEditInterview={interview => setEditInterview({ visible: true, interview })}
                    deleteInterview={deleteInterview}
                />

                <ReportsTable
                    profile={profile}
                    userRole={userRole}
                    interviews={completedInterviews}
                    loading={interviewsLoading}
                />
                <ScheduleInterviewModal
                    open={editInterview.visible}
                    interview={editInterview.interview}
                    candidateId={editInterview.interview?.candidateId}
                    onClose={() => setEditInterview({ visible: false })}
                />
            </div>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, deleteInterview, loadTeamMembers, loadCandidates };
const mapState = (state: RootState) => {
    return {
        uncompletedInterviews: selectUncompletedInterviewData(state),
        completedInterviews: selectCompletedInterviewData(state),
        interviewsLoading: state.interviews.apiResults.GetInterviews.status === ApiRequestStatus.InProgress,
        profile: state.user.profile,
        userRole: state.team.details ? selectUserRole(state.team.details) : TeamRole.INTERVIEWER,
    };
};

export default connect(mapState, mapDispatch)(Interviews);
