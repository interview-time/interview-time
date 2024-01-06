import { Col, ConfigProvider, List, Row, Typography } from "antd";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CardHero from "../../components/card/card-hero";
import EmptyState from "../../components/empty-state/empty-state";
import Layout from "../../components/layout/layout";
import TemplateCard from "../../components/template-card/template-card";
import { loadCandidates } from "../../store/candidates/actions";
import { loadInterviews } from "../../store/interviews/actions";
import { selectGetInterviewsStatus, selectUncompletedUserInterviews } from "../../store/interviews/selector";
import { Interview, Template } from "../../store/models";
import { ApiRequestStatus } from "../../store/state-models";
import { loadTemplates } from "../../store/templates/actions";
import { selectRecentTemplates } from "../../store/templates/selector";
import { CalendarIcon, NewFileIcon, UserAddIcon } from "../../utils/icons";
import { routeInterviewScorecard, routeTeamMembers, routeTemplates } from "../../utils/route";
import ScheduleInterviewModal from "../interview-schedule/schedule-interview-modal";
import InterviewCard from "../interviews/interview-card";

const { Title } = Typography;
const iconStyle = { fontSize: 24, color: "#8C2BE3" };

const Dashboard = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const uncompletedInterviews: Interview[] = useSelector(selectUncompletedUserInterviews, shallowEqual);
    const templates: Template[] = useSelector(selectRecentTemplates, shallowEqual);

    const getInterviewsStatus: ApiRequestStatus = useSelector(selectGetInterviewsStatus, shallowEqual);
    const interviewsLoading = getInterviewsStatus === ApiRequestStatus.InProgress;

    const [interviewVisible, setInterviewVisible] = useState(false);

    React.useEffect(() => {
        dispatch(loadInterviews());
        dispatch(loadCandidates());
        dispatch(loadTemplates());
        // eslint-disable-next-line
    }, []);

    const onNewTemplateClicked = () => history.push(routeTemplates());

    const onScheduleInterviewClicked = () => setInterviewVisible(true);

    const onInviteTeamMembers = () => history.push(routeTeamMembers());

    const onInterviewClicked = (interview: Interview) => history.push(routeInterviewScorecard(interview.interviewId));

    return (
        // @ts-ignore
        <Layout>
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
            <ConfigProvider renderEmpty={() => <EmptyState message='You currently don’t have any interviews.' />}>
                <List
                    style={{ marginTop: 24 }}
                    grid={{ gutter: 32, column: 1 }}
                    split={false}
                    dataSource={uncompletedInterviews.slice(0, 3)}
                    loading={interviewsLoading}
                    pagination={{
                        defaultPageSize: 8,
                        hideOnSinglePage: true,
                    }}
                    renderItem={(interview: Interview) => (
                        <List.Item>
                            <InterviewCard interview={interview} onInterviewClicked={onInterviewClicked} />
                        </List.Item>
                    )}
                />
            </ConfigProvider>

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
            <ScheduleInterviewModal open={interviewVisible} onClose={() => setInterviewVisible(false)} />
        </Layout>
    );
};

export default Dashboard;
