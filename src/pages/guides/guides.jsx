import styles from "../guides/guides.module.css";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/layout";
import { addGuide, deleteGuide, loadGuides } from "../../store/guides/actions";
import { Avatar, Button, Card, Col, List, message, PageHeader, Popconfirm, Row, Statistic } from "antd";
import { Link, useHistory } from "react-router-dom";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { sortBy } from "lodash/collection";
import { sumBy } from "lodash/math";
import { cloneDeep } from "lodash/lang";
import { getAvatarColor} from "../../components/utils/constants";

const { Meta } = Card;

// TODO change edit action to preview

const Guides = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const { guides, guidesLoading } = useSelector(state => ({
        guides: sortBy(state.guides.guides, ['title']),
        guidesLoading: state.guides.loading
    }), shallowEqual);

    React.useEffect(() => {
        if (guides.length === 0 && !guidesLoading) {
            dispatch(loadGuides())
        }
        // eslint-disable-next-line
    }, []);

    const getTotalQuestions = (groups) =>
        sumBy(groups, (group) => group.questions ? group.questions.length : 0)

    const getAvatarText = (text) => text.split(' ').map(item => item.charAt(0)).join('')

    const onEdit = (guideId) => {
        history.push(`/templates/details/${guideId}`)
    }

    const onDelete = (guide) => {
        dispatch(deleteGuide(guide.guideId))
        message.success(`Guide '${guide.title}' removed.`);
    }

    const onCopy = (guide) => {
        const copy = cloneDeep(guide)
        copy.guideId = null
        copy.title = `Copy of ${guide.title}`
        dispatch(addGuide(copy))
        message.success(`Guide '${copy.title}' created.`);
    }

    return <Layout pageHeader={<PageHeader
        className={styles.pageHeader}
        title="Interview Templates"
        extra={[
            <Button type="primary">
                <Link to={`/templates/add`}>
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
            loading={guidesLoading}
            renderItem={guide => <List.Item>
                <Card hoverable
                      bodyStyle={{ padding: 0 }}
                      actions={[
                          <EditOutlined key="edit" onClick={() => onEdit(guide.guideId)} />,
                          <Popconfirm
                              title="Are you sure you want to duplicate this guide?"
                              onConfirm={() => {
                                  onCopy(guide)
                              }}
                              okText="Yes"
                              cancelText="No">
                              <CopyOutlined key="copy" />
                          </Popconfirm>,
                          <Popconfirm
                              title="Are you sure you want to delete this guide?"
                              onConfirm={() => {
                                  onDelete(guide)
                              }}
                              okText="Yes"
                              cancelText="No">
                              <DeleteOutlined />
                          </Popconfirm>
                      ]}>
                    <div className={styles.card} onClick={() => onEdit(guide.guideId)}>
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
    </Layout>
}

export default Guides;