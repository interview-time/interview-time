import React from "react";
import { Col, ConfigProvider, Row, Space, Table, Typography } from "antd";
import Layout from "../../components/layout/layout";
import { useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTemplates } from "../../store/templates/actions";
import { connect } from "react-redux";
import { sortBy } from "lodash/collection";
import { cloneDeep } from "lodash/lang";
import { Status } from "../../components/utils/constants";
import TemplateCard from "../../components/template-card/template-card";
import {
    routeInterviewAdd,
    routeInterviewScorecard,
    routeTeamSettings,
    routeTemplates,
} from "../../components/utils/route";
import styles from "./dashboard.module.css";
import DemoTag from "../../components/demo/demo-tag";
import { CalendarIcon, NewFileIcon, UserAddIcon } from "../../components/utils/icons";
import Card from "../../components/card/card";
import CardHero from "../../components/card/card-hero";
import TableHeader from "../../components/table/table-header";
import { localeCompare } from "../../components/utils/comparators";
import TableText from "../../components/table/table-text";
import { defaultTo } from "lodash/util";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import emptyInterview from "../../assets/empty-interview.svg";
import Text from "antd/lib/typography/Text";
import { getFormattedDateTime } from "../../components/utils/date-fns";

const { Title } = Typography;
const iconStyle = { fontSize: 24, color: "#8C2BE3" };

/**
 *
 * @param {Interview[]} interviews
 * @param {boolean} interviewsLoading
 * @param {Template[]} templates
 * @param {UserProfile} profile
 * @param loadInterviews
 * @param loadTemplates
 * @returns {JSX.Element}
 * @constructor
 */
const Dashboard = ({ interviews, interviewsLoading, templates, profile, loadInterviews, loadTemplates }) => {
    const history = useHistory();

    React.useEffect(() => {
        loadInterviews();
        loadTemplates();
        // eslint-disable-next-line
    }, []);

    const onNewTemplateClicked = () => history.push(routeTemplates());

    const onScheduleInterviewClicked = () => history.push(routeInterviewAdd());

    const onInviteTeamMembers = () => history.push(routeTeamSettings(profile.currentTeamId));

    const onRowClicked = interview => history.push(routeInterviewScorecard(interview.interviewId));

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
            title: <TableHeader>STATUS</TableHeader>,
            key: "status",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.status, b.status),
            render: interview => (
                <InterviewStatusTag
                    interviewStartDateTime={new Date(interview.interviewDateTime)}
                    status={interview.status}
                />
            ),
        },
    ];

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

const mapDispatch = { loadInterviews, loadTemplates };
const mapState = state => {
    const userState = state.user || {};
    const interviewsState = state.interviews || {};
    const templateState = state.templates || {};

    const interviews = sortBy(cloneDeep(interviewsState.interviews), ["interviewDateTime"]).filter(
        interview => interview.userId === userState.profile.userId && interview.status !== Status.SUBMITTED
    );

    const templates = sortBy(templateState.templates, ["title"]).slice(0, 3);

    return {
        interviews: interviews,
        interviewsLoading: interviewsState.loading,
        templates: templates,
        profile: userState.profile,
    };
};

export default connect(mapState, mapDispatch)(Dashboard);
