import styles from "./templates.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { addTemplate, deleteTemplate, loadTemplates } from "../../store/templates/actions";
import { Avatar, Button, Card, Col, Drawer, List, message, PageHeader, Popconfirm, Row, Statistic } from "antd";
import { Link, useHistory } from "react-router-dom";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Collection, { sortBy } from "lodash/collection";
import { sumBy } from "lodash/math";
import { cloneDeep } from "lodash/lang";
import { getAvatarColor } from "../../components/utils/constants";
import TemplateInterviewDetailsCard from "./template-interview-details-card";
import { loadQuestionBank } from "../../store/question-bank/actions";
import { routeTemplateAdd, routeTemplateDetails } from "../../components/utils/route";

const { Meta } = Card;

const Templates = ({ guides, questions, loading, loadTemplates, loadQuestionBank, deleteTemplate, addTemplate }) => {

    const emptyGuide = {
        structure: {
            groups: [],
        }
    }

    const history = useHistory();

    const [guide, setGuide] = useState(emptyGuide);
    const [previewVisible, setPreviewVisible] = useState(false);

    React.useEffect(() => {
        loadTemplates();
        loadQuestionBank();
        // eslint-disable-next-line
    }, []);

    const getTotalQuestions = (groups) =>
        sumBy(groups, (group) => group.questions ? group.questions.length : 0)

    const getAvatarText = (text) => text.split(' ').map(item => item.charAt(0)).join('')

    const onEdit = (guideId) => {
        history.push(routeTemplateDetails(guideId))
    }

    const onDelete = (guide) => {
        deleteTemplate(guide.guideId);
        message.success(`Template '${guide.title}' removed.`);
    }

    const onPreviewClosed = () => {
        setPreviewVisible(false)
    };

    const onPreview = (guideId) => {
        setGuide(guides.find(guide => guide.guideId === guideId))
        setPreviewVisible(true)
    }

    const onCopy = (guide) => {
        const copy = cloneDeep(guide)
        copy.guideId = null
        copy.title = `Copy of ${guide.title}`
        addTemplate(copy)
        message.success(`Template '${copy.title}' created.`);
    }

    return <Layout pageHeader={<PageHeader
        className={styles.pageHeader}
        title="Interview Templates"
        extra={[
            <Button type="primary">
                <Link to={routeTemplateAdd()}>
                    <span className="nav-text">Add template</span>
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
                <Card hoverable
                      bodyStyle={{ padding: 0 }}
                      actions={[
                          <EditOutlined key="edit" onClick={() => onEdit(guide.guideId)} />,
                          <Popconfirm
                              title="Are you sure you want to duplicate this template?"
                              onConfirm={() => {
                                  onCopy(guide)
                              }}
                              okText="Yes"
                              cancelText="No">
                              <CopyOutlined />
                          </Popconfirm>,
                          <Popconfirm
                              title="Are you sure you want to delete this template?"
                              onConfirm={() => {
                                  onDelete(guide)
                              }}
                              okText="Yes"
                              cancelText="No">
                              <DeleteOutlined />
                          </Popconfirm>
                      ]}>
                    <div className={styles.card} onClick={() => onPreview(guide.guideId)}>
                        <Meta
                            title={guide.title}
                            avatar={
                                <Avatar size="large"
                                        style={{
                                            backgroundColor: getAvatarColor(guide.title),
                                            verticalAlign: 'middle',
                                        }}>
                                    {getAvatarText(guide.title)}
                                </Avatar>
                            }
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
                    </div>
                </Card>
            </List.Item>}
        />
        <Drawer
            title="Interview Experience"
            width="90%"
            closable={true}
            destroyOnClose={true}
            onClose={onPreviewClosed}
            placement='right'
            visible={previewVisible}>
            <TemplateInterviewDetailsCard guide={guide} questions={questions} />
        </Drawer>
    </Layout>
}
const mapDispatch = { loadTemplates, loadQuestionBank, deleteTemplate, addTemplate };
const mapState = (state) => {
    const questionBankState = state.questionBank || {};
    const guidesState = state.guides || {};

    return {
        guides: sortBy(guidesState.guides, ['title']),
        questions: Collection.sortBy(questionBankState.questions, ['question']),
        loading: guidesState.loading || questionBankState.loading
    }
}

export default connect(mapState, mapDispatch)(Templates);