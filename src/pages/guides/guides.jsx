import React, {useState} from "react";
import Layout from "../../components/layout/layout";
import {Tooltip, Avatar, Button, PageHeader, Input, List, Card} from "antd";
import styles from "../guides/guides.module.css";
import {Link} from "react-router-dom";
import {
    CopyOutlined,
    EditOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

const {Search} = Input;
const {Meta} = Card;

const data = [
    {
        title: 'Senior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        description: 'Technical, 60min'
    },
    {
        title: 'Middle Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        description: 'Technical, 50min'
    },
    {
        title: 'Junior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        description: 'Technical, 40min'
    },
    {
        title: 'Junior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        description: 'Technical, 40min'
    },
    {
        title: 'Junior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        description: 'Technical, 40min'
    },
    {
        title: 'Junior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        description: 'Technical, 40min'
    },
];

const Guides = () => {
    const [guides, setGuides] = useState(data)

    function onSearchTextChanged(e) {
        onSearchClicked(e.target.value)
    }

    function onSearchClicked(text) {
        let lowerCaseText = text.toLocaleLowerCase()
        setGuides(data.filter(item =>
            item.title.toLocaleLowerCase().includes(lowerCaseText)
            || item.description.toLocaleLowerCase().includes(lowerCaseText)
        ))
    }

    return <Layout pageHeader={<PageHeader
        className={styles.pageHeader}
        title="Interview Guides"
        extra={[
            <Search placeholder="Search" className={styles.search} allowClear enterButton
                    onSearch={onSearchClicked} onChange={onSearchTextChanged}/>,
            <Button type="primary">
                <Link to={`/guides/add`}>
                    <span className="nav-text">Add guide</span>
                </Link>
            </Button>,
        ]}
    >
    </PageHeader>}>
        <List
            grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 4,
            }}
            dataSource={guides}
            renderItem={item => <List.Item>
                <Card
                    actions={[
                        <Tooltip title="Edit"><EditOutlined key="edit"/></Tooltip>,
                        <Tooltip title="Copy"><CopyOutlined key="copy"/></Tooltip>,
                        <Tooltip title="New Interview"><CheckCircleOutlined key="interview"/></Tooltip>,
                    ]}>
                    <Meta
                        avatar={<Avatar src={item.image}/>}
                        title={item.title}
                        description={item.description}
                    />
                </Card>
            </List.Item>}
        />
    </Layout>
}

export default Guides;