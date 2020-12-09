import React, {useState} from "react";
import Layout from "../../components/layout/layout";
import {Statistic, Row, Col, Avatar, Button, PageHeader, List, Card} from "antd";
import styles from "../guides/guides.module.css";
import {Link} from "react-router-dom";

const {Meta} = Card;

const data = [
    {
        title: 'Senior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        questions: '95',
        interviews: '32'
    },
    {
        title: 'Middle Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        questions: '95',
        interviews: '32'
    },
    {
        title: 'Junior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        questions: '95',
        interviews: '32'
    },
    {
        title: 'Junior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        questions: '95',
        interviews: '32'
    },
    {
        title: 'Junior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        questions: '95',
        interviews: '32'
    },
    {
        title: 'Junior Android Engineer',
        image: 'https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg',
        questions: '95',
        interviews: '32'
    },
];

const Guides = () => {
    const [guides, setGuides] = useState(data)

    return <Layout pageHeader={<PageHeader
        className={styles.pageHeader}
        title="Interview Guides"
        extra={[
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
                <Link to={`/guides/add`}>
                    <Card hoverable>
                        <Meta
                            avatar={<Avatar src={item.image} />}
                            title={item.title}
                        />
                        <Row span={24}>
                            <Col span={12}>
                                <Statistic title="Questions"
                                           value={item.questions}
                                           valueStyle={{fontSize: "large"}} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Interviews"
                                           value={item.interviews}
                                           valueStyle={{fontSize: "large"}} />
                            </Col>
                        </Row>
                    </Card>
                </Link>
            </List.Item>}
        />
    </Layout>
}

export default Guides;