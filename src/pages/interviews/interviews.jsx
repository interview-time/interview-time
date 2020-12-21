import React, {useState} from "react";
import {Link} from "react-router-dom";
import Layout from "../../components/layout/layout";
import {loadInterviews} from "../../store/interviews/actions";
import styles from "../interviews/interviews.module.css";
import {Badge, Button, Input, PageHeader, Table, Tag} from 'antd';
import {connect} from "react-redux";

const {Search} = Input;

const ASSESSMENT_YES = 'yes';
const ASSESSMENT_NO = 'no';
const ASSESSMENT_STRONG_YES = 'strong yes';
const ASSESSMENT_STRONG_NO = 'strong no';
const STATUS_COMPLETED = 'Completed';
const STATUS_SCHEDULED = 'Scheduled';

const columns = [
    {
        title: 'Candidate Name',
        dataIndex: 'name',
        key: 'name',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, item) =>
            <Link to={`/interviews/start/${item.id}`}>
                <span className="nav-text">{text}</span>
            </Link>,
    },
    {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
        title: 'Guide',
        dataIndex: 'guide',
        key: 'guide',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.guide.localeCompare(b.guide),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: status => {
            let color = "default"
            if (status === STATUS_COMPLETED) {
                color = "default"
            } else if (status === STATUS_SCHEDULED) {
                color = "processing"
            }
            return <Badge status={color} text={status} />;
        },
    },
    {
        title: 'Assessment',
        key: 'tags',
        dataIndex: 'tags',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = 'grey';
                    if (tag === ASSESSMENT_YES || tag === ASSESSMENT_STRONG_YES) {
                        color = 'green';
                    } else if (tag === ASSESSMENT_NO || tag === ASSESSMENT_STRONG_NO) {
                        color = 'red';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    }
];

const Interviews = ({interviewsRemote, loading, loadInterviews}) => {
    const [interviews, setInterviews] = useState(interviewsRemote)

    React.useEffect(() => {
        if (interviewsRemote.length === 0 && !loading) {
            loadInterviews();
        }
    }, []);

    React.useEffect(() => {
        setInterviews(interviewsRemote)
    }, [interviewsRemote]);

    function onSearchTextChanged(e) {
        onSearchClicked(e.target.value)
    }

    function onSearchClicked(text) {
        let lowerCaseText = text.toLocaleLowerCase()
        setInterviews(interviewsRemote.filter(item =>
            item.name.toLocaleLowerCase().includes(lowerCaseText)
            || item.guide.toLocaleLowerCase().includes(lowerCaseText)
            || item.date.includes(lowerCaseText)
            || item.status.toLocaleLowerCase().includes(lowerCaseText)
            || item.tags.includes(lowerCaseText)
        ))
    }

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Interviews"
            extra={[
                <Search placeholder="Search" style={{width: 400}} allowClear enterButton
                        onSearch={onSearchClicked} onChange={onSearchTextChanged} />,
                <Button type="primary">
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
    const {interviews, loading} = state.interviews || {};

    return {interviewsRemote: interviews, loading};
};

export default connect(mapStateToProps, {loadInterviews})(Interviews);