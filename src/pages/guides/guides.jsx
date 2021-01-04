import React from "react";
import {connect} from "react-redux";
import Arrays from "lodash";
import Layout from "../../components/layout/layout";
import {loadGuides} from "../../store/guides/actions";
import {Avatar, Button, Card, Col, List, PageHeader, Row, Statistic} from "antd";
import styles from "../guides/guides.module.css";
import {Link} from "react-router-dom";

const {Meta} = Card;

const Guides = ({guides, loading, loadGuides}) => {

    React.useEffect(() => {
        if (guides.length === 0 && !loading) {
            loadGuides();
        }
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
                        <Meta
                            avatar={<Avatar src={guide.image} />}
                            title={guide.title}
                        />
                        <Row span={24}>
                            <Col span={12}>
                                <Statistic title="Questions"
                                           value={Arrays.sumBy(guide.structure.groups, (group) => {
                                               return group.questions ? group.questions.length : 0;
                                           })}
                                           valueStyle={{fontSize: "large"}} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Interviews"
                                           value={guide.totalInterviews}
                                           valueStyle={{fontSize: "large"}} />
                            </Col>
                        </Row>
                    </Card>
                </Link>
            </List.Item>}
        />
    </Layout>
}

const mapStateToProps = state => {
    const {guides, loading} = state.guides || {};

    return {guides: Arrays.sortBy(guides, ['title']), loading: loading};
};

export default connect(mapStateToProps, {loadGuides})(Guides);