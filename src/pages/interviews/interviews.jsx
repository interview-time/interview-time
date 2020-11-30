import React, {useState} from "react";
import {Link} from "react-router-dom";
import Layout from "../../components/layout/layout";
import styles from "../interviews/interviews.module.css";
import {Input, Button, PageHeader, Space, Table, Tag, Badge} from 'antd';
import {
    EditTwoTone,
    DeleteTwoTone,
} from '@ant-design/icons';

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
        render: text =>
            <Link to={`/interviews/detail`}>
                <span className="nav-text">{text}</span>
            </Link>,
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
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space size="middle">
                <a><EditTwoTone /></a>
                <a><DeleteTwoTone /></a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        guide: 'Android Developer',
        date: '12-02-2020 09:30',
        tags: [ASSESSMENT_STRONG_YES],
        status: 'Completed',
    },
    {
        key: '2',
        name: 'Dmytro Danylyk',
        guide: 'Android Developer',
        date: '12-02-2020 09:30',
        tags: [ASSESSMENT_NO],
        status: 'Completed',
    },
    {
        key: '3',
        name: 'Julia Danylyk',
        guide: 'Android Developer',
        date: '14-03-2020 09:30',
        tags: [ASSESSMENT_YES],
        status: 'Scheduled',
    },
];

const Interviews = () => {
    const [interviews, setInterviews] = useState(data)

    function onSearchTextChanged(e) {
        onSearchClicked(e.target.value)
    }

    function onSearchClicked(text) {
        let lowerCaseText = text.toLocaleLowerCase()
        setInterviews(data.filter(item =>
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
            <Table columns={columns} dataSource={interviews} />
        </Layout>
    )
}

export default Interviews;