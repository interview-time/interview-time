import React from "react";
import { connect } from "react-redux";
import Arrays from "lodash";
import Layout from "../../components/layout/layout";
import { loadGuides } from "../../store/guides/actions";
import { Avatar, Button, Card, Col, List, PageHeader, Row, Statistic } from "antd";
import styles from "../guides/guides.module.css";
import { Link } from "react-router-dom";

const { Meta } = Card;

const Guides = ({ guides, loading, loadGuides }) => {

    const colors = [
        '#2f54eb',
        '#722ed1',
        '#eb2f96',
        '#52c41a',
        '#13c2c2',
        '#1890ff',
        '#faad14',
        '#a0d911',
        '#f5222d',
    ]

    const getAvatarColor = (text) => {
        let index = text.charCodeAt(0);
        while (index > colors.length - 1) {
            index = index % 10
        }
        return colors[index]
    }

    const getTotalQuestions = (groups) =>
        Arrays.sumBy(groups, (group) => group.questions ? group.questions.length : 0)

    const getAvatarText = (text) => text.split(' ').map(item => item.charAt(0)).join('')

    React.useEffect(() => {
        if (guides.length === 0 && !loading) {
            loadGuides();
        }
        // eslint-disable-next-line 
    }, []);

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
            loading={loading}
            renderItem={guide => <List.Item>
                <Link to={`/guides/details/${guide.guideId}`}>
                    <Card hoverable>
                        <Meta avatar={
                            <Avatar size="large"
                                    style={{ backgroundColor: getAvatarColor(guide.title), verticalAlign: 'middle', }}>
                                {getAvatarText(guide.title)}
                            </Avatar>}
                              title={guide.title}
                        />
                        <Row span={24}>
                            <Col span={12}>
                                <Statistic title="Questions"
                                           value={getTotalQuestions(guide.structure.groups)}
                                           valueStyle={{ fontSize: "large" }} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Interviews"
                                           value={guide.totalInterviews}
                                           valueStyle={{ fontSize: "large" }} />
                            </Col>
                        </Row>
                    </Card>
                </Link>
            </List.Item>}
        />
    </Layout>
}

const mapStateToProps = state => {
    const { guides, loading } = state.guides || {};

    return { guides: Arrays.sortBy(guides, ['title']), loading: loading };
};

export default connect(mapStateToProps, { loadGuides })(Guides);