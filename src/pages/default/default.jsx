import React from "react";
import { Row, Col, Card, Typography, Table, Modal, Tag } from "antd";
import Layout from "../../components/layout/layout";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as TemplateIcon } from "../../assets/template.svg";
import { ReactComponent as CsvIcon } from "../../assets/csv.svg";
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
import { routeInterviewScorecard, routeInterviewAdd, routeLibrary } from "../../components/utils/route";
import { createEvent } from "../../analytics";
import styles from "./default.module.css";

const { Title, Text } = Typography;

const columns = [
    {
        key: "candidate",
        dataIndex: "candidate",
        render: (candidate, isDemo) => (
            <>
                <span>{candidate}</span>
                {isDemo && (
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

    function info() {
        createEvent("Import from CSV", "Clicked");
        Modal.info({
            title: "Import from CSV",
            content: (
                <div>
                    <p>Coming soon...</p>
                </div>
            ),
            onOk() {},
        });
    }

    return (
        <Layout>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <div className={styles.header}>
                    <Title level={2}>Create new interview</Title>
                    <span className={styles.subTitle}>How would you like to start?</span>
                </div>
                <Row justify="space-between" gutter={[32, 32]}>
                    <Col span={24} lg={{ span: 8 }}>
                        <Card
                            hoverable
                            bodyStyle={{ padding: 0 }}
                            onClick={() => history.push(routeInterviewAdd())}
                        >
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <PlusIcon width={50} height={50} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <Title level={5}>Blank interview</Title>
                                    <Text type="secondary">Start from scratch</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={24} lg={{ span: 8 }}>
                        <Card
                            hoverable
                            bodyStyle={{ padding: 0 }}
                            onClick={() => history.push(routeLibrary())}
                        >
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <TemplateIcon width={50} height={50} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <Title level={5}>From template</Title>
                                    <Text type="secondary">Choose from our library of templates</Text>
                                    <div></div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={24} lg={{ span: 8 }}>
                        <Card hoverable bodyStyle={{ padding: 0 }} onClick={() => info()}>
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <CsvIcon width={50} height={50} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <Title level={5}>From CSV file</Title>
                                    <Text type="secondary">Import your existing questions</Text>
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
