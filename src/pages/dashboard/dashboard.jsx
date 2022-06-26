import React from "react";
import { Col, ConfigProvider, Row, Space, Table, Typography } from "antd";
import Layout from "../../components/layout/layout";
import { useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTemplates } from "../../store/templates/actions";
import { connect } from "react-redux";
import { sortBy } from "lodash/collection";
import TemplateCard from "../../components/template-card/template-card";
import {
    routeCandidateDetails,
    routeInterviewAdd,
    routeInterviewScorecard,
    routeTeamMembers,
    routeTemplates,
} from "../../utils/route";
import styles from "./dashboard.module.css";
import { CalendarIcon, NewFileIcon, UserAddIcon } from "../../utils/icons";
import Card from "../../components/card/card";
import CardHero from "../../components/card/card-hero";
import emptyInterview from "../../assets/empty-interview.svg";
import Text from "antd/lib/typography/Text";
import { CandidateColumn, DateColumn, InterviewColumn, StatusColumn } from "../../components/table/table-interviews";
import { selectUncompletedInterviews } from "../../store/interviews/selector";
import { loadCandidates } from "../../store/candidates/actions";
import { loadTeamMembers } from "../../store/user/actions";

const { Title } = Typography;
const iconStyle = { fontSize: 24, color: "#8C2BE3" };

/**
 *
 * @param {Interview[]} interviews
 * @param {boolean} interviewsLoading
 * @param {Template[]} templates
 * @param {UserProfile} profile
 * @param loadInterviews
 * @param loadCandidates
 * @param loadTeamMembers
 * @param loadTemplates
 * @returns {JSX.Element}
 * @constructor
 */
const Dashboard = ({
    interviews,
    interviewsLoading,
    templates,
    profile,
    loadInterviews,
    loadCandidates,
    loadTeamMembers,
    loadTemplates,
}) => {
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

    const onRowClicked = interview => history.push(routeInterviewScorecard(interview.interviewId));

    const onCandidateClicked = (e, candidateId) => {
        e.stopPropagation(); // prevent opening report
        history.push(routeCandidateDetails(candidateId));
    };

    const columns = [CandidateColumn(onCandidateClicked), InterviewColumn(), DateColumn(), StatusColumn()];

    return (
        <Layout contentStyle={styles.rootContainer}>
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
                        <TemplateCard key={template.templateId} template={template} />
                    </Col>
                ))}
            </Row>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, loadCandidates, loadTeamMembers, loadTemplates };
const mapState = state => {
    const userState = state.user || {};
    const interviewsState = state.interviews || {};
    const templateState = state.templates || {};

    const templates = sortBy(templateState.templates, ["title"]).slice(0, 3);

    return {
        interviews: selectUncompletedInterviews(state).filter(
            interview => interview.interviewerId === userState.profile.userId
        ),
        interviewsLoading: interviewsState.loading,
        templates: templates,
        profile: userState.profile,
    };
};

export default connect(mapState, mapDispatch)(Dashboard);
