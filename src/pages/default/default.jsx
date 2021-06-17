import React from "react";
import { Row, Col, Card, Typography, Table, Modal } from "antd";
import Layout from "../../components/layout/layout";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as TemplateIcon } from "../../assets/template.svg";
import { ReactComponent as CsvIcon } from "../../assets/csv.svg";
import { useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTemplates, loadLibrary } from "../../store/templates/actions";
import { connect } from "react-redux";
import { sortBy } from "lodash/collection";
import { reverse, sortedUniq } from "lodash/array";
import { cloneDeep } from "lodash/lang";
import TemplateCard from "../../components/template-card/template-card";
import {
    routeInterviewScorecard,
    routeInterviewAdd,
    routeTemplates,
    routeTemplateDetails,
} from "../../components/utils/route";
import { createEvent } from "../../analytics";
import styles from "./default.module.css";

const { Title, Text } = Typography;

const columns = [
    {
        key: "candidate",
        dataIndex: "candidate",
    },
    {
        key: "position",
        dataIndex: "position",
    },
    {
        key: "date",
    },
    {
        key: "status",
    },
];

const Default = ({
    interviews,
    loadingInterviews,
    templates,
    loadingTemplates,
    loadInterviews,
    loadTemplates,
    loadLibrary,
}) => {
    const history = useHistory();

    // const [interviewsData, setInterviews] = React.useState([]);
    // const [template, setTemplate] = React.useState(emptyTemplate);

    React.useEffect(() => {
        loadInterviews();
        loadTemplates();
        loadLibrary();
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
        <Layout className={styles.page}>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <div className={styles.header}>
                    <Title level={2}>Create new interview</Title>
                    <Text type="secondary">How would you like to start</Text>
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
                            onClick={() => history.push(routeTemplates())}
                        >
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <TemplateIcon width={50} height={50} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <Title level={5}>From template</Title>
                                    <Text type="secondary">Choose from library</Text>
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
                                    <Text type="secondary">Import existing questions</Text>
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
                            dataSource={interviews}
                            loading={loadingInterviews}
                            rowClassName={styles.row}
                            onRow={(record) => ({
                                onClick: () => history.push(routeInterviewScorecard(record.interviewId)),
                            })}
                        />
                    </Col>
                </Row>

                <Title level={5}>Templates</Title>
                <Row gutter={[32, 32]}>
                    {templates.map((template) => (
                        <Col span={24} lg={{ span: 8 }}>
                            <TemplateCard
                                name={template.title}
                                image={template.image}
                                totalQuestions={0}
                                onClick={() => history.push(routeTemplateDetails(template.id))}
                            />
                        </Col>
                    ))}
                </Row>
            </Col>
        </Layout>
    );
};

const mapDispatch = { loadInterviews, loadTemplates, loadLibrary };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const templateState = state.templates || {};

    const interviews = reverse(sortBy(cloneDeep(interviewsState.interviews), ["interviewDateTime"]));

    const allTemplates = templateState.templates.concat(templateState.library);
    const templates = sortBy(allTemplates, ["title"]).slice(0, 3);

    return {
        interviews: interviews,
        loadingInterviews: interviewsState.loading,
        templates: templates,
        loadingTemplates: templateState.loading && templateState.loadingLibrary,
    };
};

export default connect(mapState, mapDispatch)(Default);
