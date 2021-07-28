import React from "react";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadInterviews } from "../../store/interviews/actions";
import styles from "../interviews/interviews.module.css";
import { Badge, Button, Card, Col, Table} from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { sortBy } from "lodash/collection";
import { DATE_FORMAT_DISPLAY, Status } from "../../components/utils/constants";
import { localeCompare } from "../../components/utils/comparators";
import { reverse } from "lodash/array";
import { cloneDeep } from "lodash/lang";
import { routeInterviewAdd, routeInterviewScorecard } from "../../components/utils/route";
import Title from "antd/lib/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import DemoTag from "../../components/demo/demo-tag";

const Interviews = ({ interviews, loading, loadInterviews }) => {
    const history = useHistory();

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    const onRowClicked = (record) => {
        history.push(routeInterviewScorecard(record.interviewId));
    };

    const getStatusColor = (interview) => {
        if (moment() > moment(interview.interviewDateTime)) {
            return "error";
        } else {
            return "processing";
        }
    };

    const getStatusText = (interview) => {
        if (moment() > moment(interview.interviewDateTime)) {
            return "not submitted";
        } else {
            return "upcoming";
        }
    };

    const columns = [
        {
            title: "Candidate Name",
            key: "candidate",
            dataIndex: "candidate",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidate, b.candidate),
            render: (candidate, interview) => {
                return (
                    <>
                        <span className="fs-mask">{candidate}</span>
                        <DemoTag isDemo={interview.isDemo}/>
                    </>
                );
            },
        },
        {
            title: "Position",
            key: "position",
            dataIndex: "position",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.position, b.position),
            render: (position) => {
                return (
                    <span className="fs-mask">{position}</span>
                );
            },
        },
        {
            title: "Date",
            key: "interviewDateTime",
            dataIndex: "interviewDateTime",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.interviewDateTime, b.interviewDateTime),
            render: (interviewDateTime) => (
                <span className="nav-text">{moment(interviewDateTime).format(DATE_FORMAT_DISPLAY)}</span>
            ),
        },
        {
            title: "Status",
            key: "status",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.status, b.status),
            render: (interview) => (
                <Badge status={getStatusColor(interview)} text={getStatusText(interview)} />
            ),
        },
    ];

    return (
        <Layout>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <div className={styles.header}>
                    <Title level={2}>Interviews</Title>
                    <span className={styles.subTitle}>
                        Schedule new interview or fill and submit existing interview scorecard
                    </span>
                </div>

                <Card bodyStyle={{ padding: 0 }}>
                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={interviews}
                        loading={loading}
                        rowClassName={styles.row}
                        onRow={(record) => ({
                            onClick: () => onRowClicked(record),
                        })}
                    />

                    <div className={styles.addContainer}>
                        <Button type="link" icon={<PlusOutlined />}>
                            <Link to={routeInterviewAdd()}> Schedule New Interview</Link>
                        </Button>
                    </div>
                </Card>
            </Col>
        </Layout>
    );
};

const mapDispatch = { loadInterviews };
const mapState = (state) => {
    const interviewsState = state.interviews || {};

    const interviews = reverse(
        sortBy(
            cloneDeep(
                interviewsState.interviews.filter((interview) => interview.status !== Status.COMPLETED)
            ),
            ["interviewDateTime"]
        )
    );

    return {
        interviews: interviews,
        loading: interviewsState.loading,
    };
};

export default connect(mapState, mapDispatch)(Interviews);
