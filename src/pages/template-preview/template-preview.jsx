import { Button, Card, Col, Divider, Dropdown, Menu, message, Row } from "antd";
import styles from "./template-preview.module.css";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { IntroSection, SummarySection, TemplateGroupsSection } from "../interview-scorecard/interview-sections";
import { addTemplate, deleteTemplate, loadTemplates, shareTemplate } from "../../store/templates/actions";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { findTemplate } from "../../components/utils/converters";
import Layout from "../../components/layout/layout";
import {
    ArrowLeftOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    ShareAltOutlined
} from "@ant-design/icons";
import Spinner from "../../components/spinner/spinner";
import confirm from "antd/lib/modal/confirm";
import { routeInterviewAddFromTemplate, routeTemplateEdit, routeTemplates } from "../../components/utils/route";
import { cloneDeep } from "lodash/lang";
import TemplateShareModal from "./template-share-modal";

/**
 *
 * @param {Template[]} templates
 * @param loadTemplates
 * @param addTemplate
 * @param deleteTemplate
 * @param shareTemplate
 * @returns {JSX.Element}
 * @constructor
 */
const TemplatePreview = ({ templates, loadTemplates, addTemplate, deleteTemplate, shareTemplate }) => {

    const history = useHistory();

    const { id } = useParams();

    const [template, setTemplate] = useState();
    const [shareModalVisible, setShareModalVisible] = useState(false);

    useEffect(() => {
        if (templates.length > 0 && !template) {
            setTemplate(findTemplate(id, templates))
        }
        // eslint-disable-next-line
    }, [templates, id]);

    useEffect(() => {
        loadTemplates();
        // eslint-disable-next-line
    }, []);

    const onBackClicked = () => {
        history.goBack();
    }

    const onEditClicked = () => {
        history.push(routeTemplateEdit(template.templateId));
    };

    const onCopyClicked = () => {
        const copy = cloneDeep(template);
        copy.templateId = null;
        copy.title = `Copy of ${template.title}`;
        addTemplate(copy);
        history.push(routeTemplates());
        message.success(`Template '${copy.title}' created.`);
    };

    const onScheduleInterviewClicked = () => {
        history.push(routeInterviewAddFromTemplate(template.templateId));
    };

    const onDeleteClicked = () => {
        confirm({
            title: `Delete '${template.title}' Template`,
            icon: <ExclamationCircleOutlined />,
            content: "Are you sure you want to delete this template-edit?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                deleteTemplate(template.templateId);
                history.push(routeTemplates());
                message.success(`Template '${template.title}' removed.`);
            },
        });
    };

    const onShareClicked = () => {
        setShareModalVisible(true)
    }

    const onShareClosed = () => {
        setShareModalVisible(false)
    }

    const onShareChange = (shared) => {
        setTemplate({
            ...template,
            isShared: shared
        })
        shareTemplate(template.templateId, shared)
    }

    const menu = (
        <Menu>
            <Menu.Item onClick={onCopyClicked}><CopyOutlined /> Copy</Menu.Item>
            <Menu.Item onClick={onDeleteClicked}><DeleteOutlined /> Delete</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={onShareClicked}><ShareAltOutlined /> Share</Menu.Item>
        </Menu>
    );

    return template ? (
        <Layout>
            <Row className={styles.rootContainer}>
                <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                    <Card className={styles.row}>
                        <div className={styles.header} style={{ marginBottom: 24 }}>
                            <div className={styles.headerTitleContainer} onClick={onBackClicked}>
                                <ArrowLeftOutlined />
                                <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                                    Interview Template - {template.title}
                                </Title>
                            </div>
                        </div>

                        <Text>Use this template to schedule new interview and customize as you go.</Text>

                        <Divider />

                        <div className={styles.divSpaceBetween}>
                            <Button type="primary" onClick={onScheduleInterviewClicked}>Schedule interview</Button>

                            <Dropdown.Button overlay={menu} onClick={onEditClicked}>
                                <EditOutlined /> Edit
                            </Dropdown.Button>
                        </div>
                    </Card>
                    <Card className={styles.row}>
                        <IntroSection interview={template} />
                    </Card>
                    <div className={styles.row}>
                        <TemplateGroupsSection template={template} />
                    </div>
                    <Card className={styles.rowEnd}>
                        <SummarySection interview={template} />
                    </Card>
                </Col>
            </Row>
            <TemplateShareModal
                shared={template.isShared}
                token={template.token}
                visible={shareModalVisible}
                onShareChange={onShareChange}
                onClose={onShareClosed}
            />
        </Layout>
    ) : (
        <Spinner />
    );
};

const mapDispatch = { loadTemplates, deleteTemplate, addTemplate, shareTemplate };
const mapState = (state) => {
    const templateState = state.templates || {};

    return {
        templates: templateState.templates
    };
};

export default connect(mapState, mapDispatch)(TemplatePreview);