import React from "react";
import { Card, Col, Row, Table, Tag, Typography } from "antd";
import Layout from "../../components/layout/layout";
import { useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTemplates } from "../../store/templates/actions";
import { connect } from "react-redux";
import { sortBy } from "lodash/collection";
import { reverse } from "lodash/array";
import { cloneDeep } from "lodash/lang";
import moment from "moment";
import { DATE_FORMAT_DISPLAY } from "../../components/utils/constants";
import TemplateCard from "../../components/template-card/template-card";
import { routeInterviewAdd, routeInterviewScorecard, routeTemplateNew } from "../../components/utils/route";
import styles from "./default.module.css";
import scheduleIcon from "../../assets/schedule.svg";
import templateIcon from "../../assets/template.svg";

const { Title, Text } = Typography;

const columns = [
    {
        key: "candidate",
        dataIndex: "candidate",
        render: (candidate, interview) => (
            <>
                <span>{candidate}</span>
                {interview.isDemo && (
                    <Tag className={styles.demoTag} color="orange">
                        Demo
                    </Tag>
                )}
            </>
        ),
    },
    {
        key: "position",
        dataIndex: "position",
    },
    {
        key: "interviewDateTime",
        dataIndex: "interviewDateTime",
        render: (interviewDateTime) => (
            <span className="nav-text">{moment(interviewDateTime).format(DATE_FORMAT_DISPLAY)}</span>
        ),
    },
];

/**
 *
 * @param {Interview[]} upcomingInterviews
 * @param {boolean} loadingInterviews
 * @param {Template[]} templates
 * @param {boolean} loadingTemplates
 * @param loadInterviews
 * @param loadTemplates
 * @returns {JSX.Element}
 * @constructor
 */
const Default = ({
    upcomingInterviews,
    loadingInterviews,
    templates,
    loadingTemplates,
    loadInterviews,
    loadTemplates,
}) => {
    const history = useHistory();

    React.useEffect(() => {
        loadInterviews();
        loadTemplates();
        // eslint-disable-next-line
    }, []);

    const onNewInterviewClicked = () => history.push(routeTemplateNew());

    const onScheduleInterviewClicked = () => history.push(routeInterviewAdd());

    return (
        <Layout>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <div className={styles.header}>
                    <Title level={2} style={{ margin: 0 }}>How would you like to start?</Title>
                </div>
                <Row gutter={[32, 32]}>
                    <Col span={24} lg={{ span: 8, offset: 4 }}>
                        <Card
                            hoverable
                            bodyStyle={{ padding: 0 }}
                            onClick={onScheduleInterviewClicked}
                        >
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <img alt="Schedule interview" src={scheduleIcon} width={50} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <Title level={5}>Schedule interview</Title>
                                    <Text type="secondary">Use one of your interview templates</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={24} lg={{ span: 8 }}>
                        <Card
                            hoverable
                            bodyStyle={{ padding: 0 }}
                            onClick={onNewInterviewClicked}
                        >
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <img alt="Create template" src={templateIcon} width={50} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <Title level={5}>Create template</Title>
                                    <Text type="secondary">Blank or from public library of templates</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Title level={5}>Upcoming Interviews</Title>
                <Row gutter={[32, 32]}>
                    <Col span={24}>
                        <Table
                            pagination={false}
                            columns={columns}
                            showHeader={false}
                            dataSource={upcomingInterviews}
                            loading={loadingInterviews}
                            rowClassName={styles.row}
                            onRow={(record) => ({
                                onClick: () => history.push(routeInterviewScorecard(record.interviewId)),
                            })}
                        />
                    </Col>
                </Row>

                <Title level={5}>Recent templates</Title>
                <Row gutter={[32, 32]}>
                    {templates.map((template) => (
                        <Col span={24} lg={{ span: 8 }}>
                            <TemplateCard key={template.templateId} template={template} />
                        </Col>
                    ))}
                </Row>
            </Col>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, loadTemplates };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const templateState = state.templates || {};

    const interviews = reverse(sortBy(cloneDeep(interviewsState.interviews), ["interviewDateTime"]));

    const templates = sortBy(templateState.templates, ["title"]).slice(0, 3);

    return {
        upcomingInterviews: interviews.filter((i) => Date.parse(i.interviewDateTime) > Date.now()),
        loadingInterviews: interviewsState.loading,
        templates: templates,
        loadingTemplates: templateState.loading,
    };
};

export default connect(mapState, mapDispatch)(Default);
