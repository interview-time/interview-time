import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTemplates } from "../../store/templates/actions";
import styles from "../interviews/interviews.module.css";
import { Alert, Badge, Button, Card, Input, Space, Table, Tag } from 'antd';
import { connect } from "react-redux";
import moment from "moment";
import { sortBy } from "lodash/collection";
import {
    DATE_FORMAT_DISPLAY,
    getDecisionColor,
    getDecisionText,
    getStatusColor,
    getStatusText
} from "../../components/utils/constants";
import { localeCompare } from "../../components/utils/comparators";
import { reverse } from "lodash/array";
import { cloneDeep } from "lodash/lang";
import { routeInterviewAdd, routeInterviewScorecard } from "../../components/utils/route";
import StickyHeader from "../../components/layout/header-sticky";

const { Search } = Input;

const columns = [
    {
        title: 'Candidate Name',
        key: 'candidate',
        dataIndex: 'candidate',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => localeCompare(a.candidate, b.candidate),
    },
    {
        title: 'Position',
        key: 'position',
        dataIndex: 'position',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => localeCompare(a.position, b.position),
    },
    {
        title: 'Template',
        key: 'template',
        dataIndex: 'template',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => localeCompare(a.template, b.template),
    },
    {
        title: 'Date',
        key: 'interviewDateTime',
        dataIndex: 'interviewDateTime',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => localeCompare(a.interviewDateTime, b.interviewDateTime),
        render: interviewDateTime => <span
            className="nav-text">{moment(interviewDateTime).format(DATE_FORMAT_DISPLAY)}</span>
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => localeCompare(a.status, b.status),
        render: status => <Badge status={getStatusColor(status)} text={getStatusText(status)} />,
    },
    {
        title: 'Recommendation',
        key: 'decision',
        dataIndex: 'decision',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => localeCompare(a.decision, b.decision),
        render: decision => (
            <>
                {decision && <Tag color={getDecisionColor(decision)} key={decision}>
                    {getDecisionText(decision)}
                </Tag>}
            </>
        ),
    }
];

const Interviews = ({ interviews, loading, loadInterviews, loadTemplates }) => {

    const history = useHistory();
    const [interviewsData, setInterviews] = useState([])

    React.useEffect(() => {
        loadInterviews();
        loadTemplates();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setInterviews(interviews)
        // eslint-disable-next-line
    }, [interviews]);

    const onRowClicked = (record) => {
        history.push(routeInterviewScorecard(record.interviewId));
    }

    const onSearchTextChanged = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase()
        setInterviews(interviewsData.filter(item =>
            item.candidate.toLocaleLowerCase().includes(lowerCaseText)
            || item.position.toLocaleLowerCase().includes(lowerCaseText)
            || moment(item.interviewDateTime).format('lll').toLocaleLowerCase().includes(lowerCaseText)
            || getStatusText(item.status).toLocaleLowerCase().includes(lowerCaseText)
            || getDecisionText(item.decision).toLocaleLowerCase().includes(lowerCaseText)
        ))
    };

    return (
        <Layout pageHeader={
            <StickyHeader title="Interviews">
                <Space>
                    <Search placeholder="Search" key="search" className={styles.headerSearch} allowClear
                            onSearch={onSearchClicked} onChange={onSearchTextChanged} />
                    <Button type="primary" key="add-interview-button">
                        <Link to={routeInterviewAdd()}>
                            <span className="nav-text">Add interview</span>
                        </Link>
                    </Button>
                </Space>
            </StickyHeader>
        } contentStyle={styles.pageContent}>
            <Alert message="Interviews help to capture candidate feedback during the interview. Use Template to quickly create the interview with all necessary questions."
                   type="info"
                   className={styles.infoAlert}
                   closable />

            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    pagination={false}
                    columns={columns}
                    dataSource={interviewsData}
                    loading={loading}
                    rowClassName={styles.row}
                    onRow={(record) => ({
                        onClick: () => onRowClicked(record),
                    })}
                />
            </Card>
        </Layout>
    )
}

const mapDispatch = { loadInterviews, loadTemplates };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const templatesState = state.templates || {};

    const interviews = reverse(sortBy(cloneDeep(interviewsState.interviews), ['interviewDateTime']))
    if (templatesState.templates.length > 0) {
        interviews.forEach(interview => {
            const template = templatesState.templates.find(template => template.templateId === interview.templateId)
            if (template) {
                interview.template = template.title
            }
        })
    }

    return {
        interviews: interviews,
        loading: interviewsState.loading || templatesState.loading
    }
}

export default connect(mapState, mapDispatch)(Interviews)