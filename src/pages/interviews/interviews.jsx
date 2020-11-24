import React from "react";
import Layout from "../../components/layout/layout";
import {Input, Button, PageHeader, Space, Table, Tag, Badge} from 'antd';
import styles from "../question-bank/question-bank.module.css";
import {
    EditTwoTone,
    DeleteTwoTone,
} from '@ant-design/icons';

const {Search} = Input;

const columns = [
    {
        title: 'Candidate Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Guide',
        dataIndex: 'guide',
        key: 'guide',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
            <Badge status="default" text={status}/>
        ),
    },
    {
        title: 'Assessment',
        key: 'assessment',
        dataIndex: 'assessment',
        render: assessment => (
            <>
                {
                    <Tag color={'green'} key={assessment}>{assessment.toUpperCase()}</Tag>
                }
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
        status: 'Completed',
        assessment: 'yes',
    },
    {
        key: '2',
        name: 'John Brown',
        guide: 'Android Developer',
        date: '12-02-2020 09:30',
        status: 'Completed',
        assessment: 'yes',
    },
    {
        key: '3',
        name: 'John Brown',
        guide: 'Android Developer',
        date: '12-02-2020 09:30',
        status: 'Completed',
        assessment: 'yes',
    },
];


const Interviews = () => {
    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Interviews">
            <div>
                <Search placeholder="Search" style={{width: 400, margin: '0 24px 0 0'}} allowClear enterButton />
                <Button type="primary">Add interview</Button>
            </div>
        </PageHeader>}>
            <Table columns={columns} dataSource={data} />
        </Layout>
    )
}

export default Interviews;