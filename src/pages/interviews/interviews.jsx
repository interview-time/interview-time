import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadInterviews } from "../../store/interviews/actions";
import { loadGuides } from "../../store/guides/actions";
import styles from "../interviews/interviews.module.css";
import { Badge, Button, Input, PageHeader, Table, Tag } from 'antd';
import { connect } from "react-redux";
import moment from "moment";
import lang from "lodash/lang"
import utils from "lodash/util"
import array from "lodash/array";
import collection from "lodash/collection";
import { DATE_FORMAT_DISPLAY, getDecisionColor, getDecisionText, Status } from "../../components/utils/constants";

const { Search } = Input;

const columns = [
    {
        title: 'Candidate Name',
        key: 'candidate',
        dataIndex: 'candidate',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.candidate.localeCompare(b.candidate),
        render: (text, item) =>
            <Link to={`/interviews/start/${item.interviewId}`}>
                <span className="nav-text">{text}</span>
            </Link>,
    },
    {
        title: 'Position',
        key: 'position',
        dataIndex: 'position',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
        title: 'Guide',
        key: 'guide',
        dataIndex: 'guide',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => utils.defaultTo(a.guide, '').localeCompare(utils.defaultTo(b.guide, '')),
    },
    {
        title: 'Date',
        key: 'interviewDateTime',
        dataIndex: 'interviewDateTime',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.interviewDateTime.localeCompare(b.interviewDateTime),
        render: interviewDateTime => <span className="nav-text">{moment(interviewDateTime).format(DATE_FORMAT_DISPLAY)}</span>
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: status => <Badge status={getStatusColor(status)} text={getStatusText(status)} />,
    },
    {
        title: 'Assessment',
        key: 'decision',
        dataIndex: 'decision',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => utils.defaultTo(a.decision, '').localeCompare(utils.defaultTo(b.decision, '')),
        render: decision => (
            <>
                {decision && <Tag color={getDecisionColor(decision)} key={decision}>
                    {getDecisionText(decision)}
                </Tag>}
            </>
        ),
    }
];

const getStatusColor = (status) => {
    if (status === Status.COMPLETED) {
        return "default"
    } else if (status === Status.STARTED) {
        return "processing"
    } else if (status === Status.NEW) {
        return "success"
    }
}

const getStatusText = (status) => {
    if (status === Status.COMPLETED) {
        return "Completed"
    } else if (status === Status.STARTED) {
        return "Started"
    } else if (status === Status.NEW) {
        return "New"
    }
}

const Interviews = ({ interviewsRemote, guides, loading, loadInterviews, loadGuides }) => {
    const [interviews, setInterviews] = useState(interviewsRemote)

    React.useEffect(() => {
        if (interviewsRemote.length === 0 && !loading) {
            loadInterviews();
            loadGuides();
        }
        // eslint-disable-next-line 
    }, []);

    React.useEffect(() => {
        const interviews = lang.cloneDeep(interviewsRemote)
        if (guides.length > 0) {
            interviews.forEach((interview) => {
                const guide = guides.find((guide) => guide.guideId === interview.guideId)
                if (guide) {
                    interview.guide = guide.title
                }
            })
        }
        setInterviews(interviews)
    }, [guides, interviewsRemote]);

    const onSearchTextChanged = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase()
        setInterviews(interviewsRemote.filter(item =>
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
                    <Link to={`/interviews/add`}>
                        <span className="nav-text">Add interview</span>
                    </Link>
                </Button>,
            ]}
        >
        </PageHeader>}>
            <Table columns={columns} dataSource={interviews} loading={loading} />
        </Layout>
    )
}

const mapStateToProps = state => {
    const { interviews, loading } = state.interviews || {};
    const { guides } = state.guides || {};

    return { interviewsRemote: array.reverse(collection.sortBy(interviews, ['interviewDateTime'])), guides, loading };
};

export default connect(mapStateToProps, { loadInterviews, loadGuides })(Interviews);