import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTemplates } from "../../store/templates/actions";
import styles from "../interviews/interviews.module.css";
import { Badge, Button, Card, Input, PageHeader, Table, Tag } from 'antd';
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
import { routeInterviewAdd, routeStartInterview } from "../../components/utils/route";

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
        key: 'guide',
        dataIndex: 'guide',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => localeCompare(a.guide, b.guide),
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
        title: 'Decision',
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
        history.push(routeStartInterview(record.interviewId));
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
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Interviews"
            extra={[
                <Search placeholder="Search" key="search" style={{ width: 400 }} allowClear enterButton
                        onSearch={onSearchClicked} onChange={onSearchTextChanged} />,
                <Button type="primary" key="add-interview-button">
                    <Link to={routeInterviewAdd()}>
                        <span className="nav-text">Add interview</span>
                    </Link>
                </Button>,
            ]}
        >
        </PageHeader>}>
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
    const guidesState = state.guides || {};

    const interviews = reverse(sortBy(cloneDeep(interviewsState.interviews), ['interviewDateTime']))
    if (guidesState.guides.length > 0) {
        interviews.forEach(interview => {
            const guide = guidesState.guides.find(guide => guide.guideId === interview.guideId)
            if (guide) {
                interview.guide = guide.title
            }
        })
    }

    return {
        interviews: interviews,
        loading: interviewsState.loading || guidesState.loading
    }
}

export default connect(mapState, mapDispatch)(Interviews)