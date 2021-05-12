import styles from "./templates.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { addTemplate, deleteTemplate, loadTemplates } from "../../store/templates/actions";
import { Alert, Avatar, Button, Card, Col, Dropdown, List, Menu, message, Modal, Row, Space, Tooltip } from "antd";
import { Link, useHistory } from "react-router-dom";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { flatMap, sortBy } from "lodash/collection";
import { sumBy } from "lodash/math";
import { cloneDeep } from "lodash/lang";
import { loadQuestionBank } from "../../store/question-bank/actions";
import { routeTemplateAdd, routeTemplateDetails } from "../../components/utils/route";
import { useAuth0 } from "../../react-auth0-spa";
import { getTemplateCategoryIcon, TemplateCategories } from "../../components/utils/constants";
import confirm from "antd/lib/modal/confirm";
import { CustomIcon } from "../../components/utils/icons";
import { TemplatePreviewCard } from "../interview-scorecard/interview-sections";
import StickyHeader from "../../components/layout/header-sticky";

const NEW_TEMPLATE = "NEW_TEMPLATE"

const Templates = ({ guides, questions, loading, loadTemplates, loadQuestionBank, deleteTemplate, addTemplate }) => {

    const emptyGuide = {
        structure: {
            groups: [],
        }
    }

    const history = useHistory();
    const { user } = useAuth0();

    const [guide, setGuide] = useState(emptyGuide);
    const [previewVisible, setPreviewVisible] = useState(false);

    React.useEffect(() => {
        loadTemplates();
        loadQuestionBank();
        // eslint-disable-next-line
    }, []);

    const onAddTemplateClicked = () => {
        history.push(routeTemplateAdd())
    }

    const getTotalQuestions = (groups) =>
        sumBy(groups, (group) => group.questions ? group.questions.length : 0)

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

    const getUserName = () => {
        if (user && user.name) {
            return user.name;
        }
        return 'Unknown User'
    }

    const getCategory = (guide) => {
        let category = TemplateCategories.find(category => category.key === guide.type)
        if (!category) {
            // backward compatibility
            category = TemplateCategories[0]
        }
        return category
    }

    const showDeleteConfirm = (guide) => {
        confirm({
            title: `Delete '${guide.title}' Template`,
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this template?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                onDelete(guide)
            }
        });
    }

    const createMenu = (guide) => <Menu>
        <Menu.Item onClick={e => {
            e.domEvent.stopPropagation()
            onEdit(guide.guideId)
        }}>Edit template</Menu.Item>
        <Menu.Item onClick={e => {
            e.domEvent.stopPropagation()
            onCopy(guide)
        }}>Copy template</Menu.Item>
        <Menu.Item danger onClick={e => {
            e.domEvent.stopPropagation()
            showDeleteConfirm(guide)
        }}>Delete template</Menu.Item>
    </Menu>;

    return <Layout pageHeader={
        <StickyHeader title="Interview Templates">
            <Button type="primary">
                <Link to={routeTemplateAdd()}>
                    <span className="nav-text">Add template</span>
                </Link>
            </Button>
        </StickyHeader>
    } contentStyle={styles.pageContent}>
        <Alert message="Templates allow you to build and manage interview templates for any type of interview, like 'Senior Java Developer' or 'Behavioral Interview'. This is a great way to keep the interview process structured and to make sure you’re asking a consistent set of questions. You can use a template when you create an interview."
               className={styles.infoAlert}
               type="info"
               closable />
        <List
            style={{marginTop: 24}}
            grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 5,
            }}
            dataSource={guides}
            loading={loading}
            renderItem={guide => <List.Item>
                <Card hoverable bodyStyle={{ padding: 0, height: 190 }}>
                    {guide !== NEW_TEMPLATE && <div className={styles.card} onClick={() => onPreview(guide.guideId)}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {getTemplateCategoryIcon(guide.type)}
                            <div style={{ color: getCategory(guide).color }}
                                 className={styles.category}>{getCategory(guide).titleShort}</div>
                            <div style={{ flexGrow: 1 }} />
                            <Dropdown overlay={createMenu(guide)}>
                                <EllipsisOutlined style={{ fontSize: 20 }} onClick={e => e.stopPropagation()} />
                            </Dropdown>
                        </div>
                        <div className={styles.cardTitle}>{guide.title}</div>

                        <Row style={{ marginTop: 12 }}>
                            <Col span={12}>
                                <div className={styles.cardMetaTitle}>QUESTIONS</div>
                                <div className={styles.cardMetaValue}>{getTotalQuestions(guide.structure.groups)}</div>
                            </Col>
                            <Col span={12}>
                                <div className={styles.cardMetaTitle}>INTERVIEWS</div>
                                <div className={styles.cardMetaValue}>{guide.totalInterviews}</div>
                            </Col>
                        </Row>

                        <Tooltip title="Author">
                            <Space style={{ marginTop: 12 }}>
                                <Avatar size={24} src={user ? user.picture : null} />
                                <span className={styles.author}>{getUserName()}</span>
                            </Space>
                        </Tooltip>
                    </div>}
                    {guide === NEW_TEMPLATE && <div className={styles.card} onClick={onAddTemplateClicked}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <CustomIcon style={{ color: '#1F1F1F', fontSize: 18 }} />
                            <div className={styles.category}>CUSTOM</div>
                        </div>
                        <div className={styles.cardTitle}>New Template</div>
                        <div className={styles.author}>
                            To keep the interview process structured, create a template for the desired role.
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button type="link">Add template</Button>
                        </div>
                    </div>}
                </Card>
            </List.Item>}
        />
        <Modal
            title="Interview Experience"
            width={1000}
            style={{ top: '5%' }}
            destroyOnClose={true}
            footer={null}
            onCancel={onPreviewClosed}
            visible={previewVisible}>
            <TemplatePreviewCard guide={guide} questions={questions} />
        </Modal>
    </Layout>
}
const mapDispatch = { loadTemplates, loadQuestionBank, deleteTemplate, addTemplate };
const mapState = (state) => {
    const questionBankState = state.questionBank || {};
    const guidesState = state.guides || {};
    const guides = sortBy(guidesState.guides, ['title']);
    guides.unshift(NEW_TEMPLATE) // first element is a new template card

    return {
        guides: guides,
        questions: flatMap(questionBankState.categories, (item) => item.questions),
        loading: guidesState.loading || questionBankState.loading
    }
}

export default connect(mapState, mapDispatch)(Templates);