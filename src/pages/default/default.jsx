import React from "react";
import { Row, Col, Card, Typography, Table } from "antd";
import Layout from "../../components/layout/layout";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as TemplateIcon } from "../../assets/template.svg";
import { ReactComponent as CsvIcon } from "../../assets/csv.svg";
import { useHistory } from "react-router-dom";
import { loadInterviews } from "../../store/interviews/actions";
import { connect } from "react-redux";
import { sortBy } from "lodash/collection";
import { reverse, sortedUniq } from "lodash/array";
import { cloneDeep } from "lodash/lang";
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

const Default = ({ interviews, loading, loadInterviews }) => {
    const history = useHistory();
    const [interviewsData, setInterviews] = React.useState([]);

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setInterviews(interviews);
        // eslint-disable-next-line
    }, [interviews]);

    return (
        <Layout className={styles.page}>
            <Col span={18} offset={3}>
                <div className={styles.header}>
                    <Title level={2}>Create new interview</Title>
                    <Text type="secondary">How would you like to start</Text>
                </div>
                <Row gutter={16}>
                    <Col>
                        <Card hoverable bodyStyle={{ padding: 0 }}>
                            <div
                                className={styles.card}
                                onClick={() => history.push("/interview/create")}
                            >
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
                    <Col>
                        <Card hoverable bodyStyle={{ padding: 0 }}>
                            <div
                                className={styles.card}
                                onClick={() => history.push("/interview/templates")}
                            >
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
                    <Col>
                        <Card hoverable bodyStyle={{ padding: 0 }}>
                            <div
                                className={styles.card}
                                onClick={() => history.push("/interview/import-csv")}
                            >
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

                <Table
                    pagination={false}
                    columns={columns}
                    showHeader={false}
                    dataSource={interviewsData}
                    loading={loading}
                    rowClassName={styles.row}
                />
            </Col>
        </Layout>
    );
};

const mapDispatch = { loadInterviews };
const mapState = (state) => {
    const interviewsState = state.interviews || {};

    const interviews = reverse(
        sortBy(cloneDeep(interviewsState.interviews), ["interviewDateTime"])
    );

    return {
        interviews: interviews,
        loading: interviewsState.loading,
    };
};

export default connect(mapState, mapDispatch)(Default);
