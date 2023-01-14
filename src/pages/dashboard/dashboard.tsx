import React from "react";
import { Col, ConfigProvider, Row, Space, Table, Typography } from "antd";
import Layout from "../../components/layout/layout";
import { useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTemplates } from "../../store/templates/actions";
import { connect } from "react-redux";
import { sortBy } from "lodash";
import TemplateCard from "../../components/template-card/template-card";
import { routeInterviewAdd, routeInterviewScorecard, routeTeamMembers, routeTemplates } from "../../utils/route";
import styles from "./dashboard.module.css";
import { CalendarIcon, NewFileIcon, UserAddIcon } from "../../utils/icons";
import Card from "../../components/card/card";
import CardHero from "../../components/card/card-hero";
import emptyInterview from "../../assets/empty-interview.svg";
import { CandidateColumn, DateColumn, TemplateColumn, StatusColumn } from "../../components/table/table-interviews";
import { loadCandidates } from "../../store/candidates/actions";
import { loadTeamMembers } from "../../store/user/actions";
import { InterviewData, selectUncompletedInterviewData } from "../../store/interviews/selector";
import { TeamRole, Template, UserProfile } from "../../store/models";
import { RootState } from "../../store/state-models";
import { selectUserRole } from "../../store/team/selector";

const { Title, Text } = Typography;
const iconStyle = { fontSize: 24, color: "#8C2BE3" };

type Props = {
    profile: UserProfile;
    userRole: TeamRole;
    interviews: InterviewData[];
    templates: Template[];
    interviewsLoading: boolean;
    loadInterviews: any;
    loadCandidates: any;
    loadTeamMembers: any;
    loadTemplates: any;
};

const Dashboard = ({
    profile,
    userRole,
    interviews,
    templates,
    interviewsLoading,
    loadInterviews,
    loadCandidates,
    loadTeamMembers,
    loadTemplates,
}: Props) => {
    const history = useHistory();

    React.useEffect(() => {
        loadInterviews();
        loadCandidates();
        loadTeamMembers(profile.currentTeamId);
        loadTemplates();
        // eslint-disable-next-line
    }, []);    

    const onNewTemplateClicked = () => history.push(routeTemplates());

    const onScheduleInterviewClicked = () => history.push(routeInterviewAdd());

    const onInviteTeamMembers = () => history.push(routeTeamMembers());

    const onRowClicked = (interview: InterviewData) => history.push(routeInterviewScorecard(interview.interviewId));

    const columns = [CandidateColumn(false), TemplateColumn(), DateColumn(), StatusColumn()];

    return (
        // @ts-ignore
        <Layout >
            <div>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Dashboard
                </Title>

                <Row gutter={[32, 32]}>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            onClick={onScheduleInterviewClicked}
                            icon={<CalendarIcon style={iconStyle} />}
                            title='Schedule interview'
                            text='Use one of your interview templates'
                        />
                    </Col>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            onClick={onNewTemplateClicked}
                            icon={<NewFileIcon style={iconStyle} />}
                            title='Create template'
                            text='Blank or from public library of templates'
                        />
                    </Col>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            onClick={onInviteTeamMembers}
                            icon={<UserAddIcon style={iconStyle} />}
                            title='Invite team members'
                            text='Anyone with the link can join your team'
                        />
                    </Col>
                </Row>
            </div>

            <Title level={5} style={{ marginBottom: 12, marginTop: 32 }}>
                Your interviews
            </Title>
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
                        scroll={{
                            x: "max-content",
                        }}
                        rowKey='interviewId'
                        pagination={false}
                        columns={columns}
                        dataSource={interviews}
                        loading={interviewsLoading}
                        rowClassName={styles.row}
                        onRow={record => ({
                            onClick: () => onRowClicked(record),
                        })}
                    />
                </ConfigProvider>
            </Card>

            <Title level={5} style={{ marginBottom: 12, marginTop: 32 }}>
                Recent templates
            </Title>
            <Row gutter={[32, 32]}>
                {templates.map(template => (
                    <Col span={24} lg={{ span: 8 }} key={template.templateId}>
                        {
                            // @ts-ignore
                            <TemplateCard key={template.templateId} template={template} />
                        }
                    </Col>
                ))}
            </Row>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, loadCandidates, loadTeamMembers, loadTemplates };
const mapState = (state: RootState) => {
    const userState = state.user;
    const interviewsState = state.interviews;
    // @ts-ignore
    const templateState = state.templates;

    const templates = sortBy(templateState.templates, ["title"]).slice(0, 3);

    return {
        interviews: selectUncompletedInterviewData(state).filter(
            interview => interview.userId === userState.profile.userId
        ),
        interviewsLoading: interviewsState.loading,
        templates: templates,
        profile: userState.profile,
        userRole: state.team.details ? selectUserRole(state.team.details) : TeamRole.INTERVIEWER,
    };
};

export default connect(mapState, mapDispatch)(Dashboard);
