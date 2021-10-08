import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadInterviews } from "../../store/interviews/actions";
import styles from "../interviews/interviews.module.css";
import { Badge, Button, Card, Col, Input, Table } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { orderBy} from "lodash/collection";
import { DATE_FORMAT_DISPLAY, Status } from "../../components/utils/constants";
import { localeCompare } from "../../components/utils/comparators";
import { routeInterviewAdd, routeInterviewScorecard } from "../../components/utils/route";
import Title from "antd/lib/typography/Title";
import DemoTag from "../../components/demo/demo-tag";
import Text from "antd/lib/typography/Text";
import { getFormattedDate, orderByInterviewDate } from "../../components/utils/utils";
import { defaultTo } from "lodash/util";

const { Search } = Input;

const Interviews = ({ interviewsData, interviewsLoading, loadInterviews }) => {

    const history = useHistory();
    const [interviews, setInterviews] = useState([])

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setInterviews(interviewsData)
        // eslint-disable-next-line
    }, [interviewsData]);

    const onRowClicked = (record) => {
        history.push(routeInterviewScorecard(record.interviewId));
    };

    const isCompleted = (interview) => interview.status === Status.COMPLETED;

    const textType = (interview) => isCompleted(interview) ? "secondary" : null;

    const getStatusColor = (interview) => {
        if (isCompleted(interview)) {
            return "success";
        } else if (moment() > moment(interview.interviewDateTime)) {
            return "error";
        } else {
            return "processing";
        }
    };

    const getStatusText = (interview) => {
        if (isCompleted(interview)) {
            return "completed";
        } else if (moment() > moment(interview.interviewDateTime)) {
            return "not submitted";
        } else {
            return "upcoming";
        }
    };

    const onScheduleInterviewClicked = () => {
        history.push(routeInterviewAdd())
    }

    const onSearchTextChanged = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase()
        setInterviews(interviewsData.filter(item =>
            item.candidate.toLocaleLowerCase().includes(lowerCaseText)
            || item.position.toLocaleLowerCase().includes(lowerCaseText)
            || moment(item.interviewDateTime).format(DATE_FORMAT_DISPLAY).toLocaleLowerCase().includes(lowerCaseText)
        ))
    };

    const columns = [
        {
            title: "Candidate Name",
            key: "candidate",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidate, b.candidate),
            render: (interview) => {
                return (
                    <>
                        <Text type={textType(interview)} className="fs-mask">{interview.candidate}</Text>
                        <DemoTag isDemo={interview.isDemo} />
                    </>
                );
            },
        },
        {
            title: "Interview Type",
            key: "position",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.position, b.position),
            render: (interview) => <Text type={textType(interview)} className="fs-mask">
                {defaultTo(interview.position, "-")}
            </Text>,
        },
        {
            title: "Date",
            key: "interviewDateTime",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.interviewDateTime, b.interviewDateTime),
            render: (interview) => (
                <Text type={textType(interview)}
                      className="fs-mask">{getFormattedDate(interview.interviewDateTime, "-")}</Text>
            ),
        },
        {
            title: "Status",
            key: "status",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.status, b.status),
            render: (interview) => (
                <Badge
                    status={getStatusColor(interview)}
                    text={<Text type={textType(interview)}>{getStatusText(interview)}</Text>} />
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

                <div className={styles.divSpaceBetween}>
                    <Search placeholder="Search"
                            key="search"
                            className={styles.headerSearch}
                            allowClear
                            onSearch={onSearchClicked}
                            onChange={onSearchTextChanged} />
                    <Button type="primary" onClick={onScheduleInterviewClicked}>Schedule New Interview</Button>
                </div>

                <Card bodyStyle={{ padding: 0 }}>
                    <Table
                        pagination={false}
                        scroll={{
                            x: 'max-content'
                        }}
                        columns={columns}
                        dataSource={interviews}
                        loading={interviewsLoading}
                        rowClassName={styles.row}
                        onRow={(record) => ({
                            onClick: () => onRowClicked(record),
                        })}
                    />
                </Card>
            </Col>
        </Layout>
    );
};

const mapDispatch = { loadInterviews };
const mapState = (state) => {
    const interviewsState = state.interviews || {};

    const interviews = orderBy(interviewsState.interviews, orderByInterviewDate, ['desc']);

    return {
        interviewsData: interviews,
        interviewsLoading: interviewsState.loading,
    };
};

export default connect(mapState, mapDispatch)(Interviews);
