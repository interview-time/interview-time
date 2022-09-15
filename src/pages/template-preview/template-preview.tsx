import { Button, Col, Divider, Dropdown, Menu, message, Row } from "antd";
import styles from "./template-preview.module.css";
import Text from "antd/lib/typography/Text";
import {
    IntroSection,
    SummarySection,
    TemplateGroupsSection,
} from "../interview-scorecard/step-assessment/type-interview/interview-sections";
import { addTemplate, deleteTemplate, loadTemplates, shareTemplate } from "../../store/templates/actions";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    ShareAltOutlined,
} from "@ant-design/icons";
import Spinner from "../../components/spinner/spinner";
import confirm from "antd/lib/modal/confirm";
import { routeInterviewAddFromTemplate, routeTemplateEdit, routeTemplates } from "../../utils/route";
import { cloneDeep } from "lodash";
import TemplateShareModal from "./template-share-modal";
import Card from "../../components/card/card";
import TitleBack from "../../components/title/title-back";
import TemplateImage from "../../components/template-card/template-image";
import { RootState } from "../../store/state-models";
import { InterviewType, SharedTemplate, Template } from "../../store/models";
import { selectAssessmentGroup, selectTemplate } from "../../store/templates/selector";
import LiveCodingAssessmentCard from "../../components/scorecard/type-live-coding/assessment-card-template";
import LiveCodingChallengeCard from "../../components/scorecard/type-live-coding/challenge-card-template";

type Props = {
    originalTemplate?: Readonly<Template>;
    loadTemplates: Function;
    addTemplate: Function;
    deleteTemplate: Function;
    shareTemplate: Function;
};

const TemplatePreview = ({ originalTemplate, loadTemplates, addTemplate, deleteTemplate, shareTemplate }: Props) => {
    const history = useHistory();

    // @ts-ignore
    const [template, setTemplate] = useState<SharedTemplate>({});
    const [shareModalVisible, setShareModalVisible] = useState(false);

    const templateLoaded = template.templateId && template.templateId.length > 0;

    useEffect(() => {
        if (originalTemplate && !templateLoaded) {
            setTemplate({
                ...originalTemplate,
                isShared: false,
                token: "",
            });
        }
        // eslint-disable-next-line
    }, [originalTemplate]);

    useEffect(() => {
        loadTemplates();
        // eslint-disable-next-line
    }, []);

    const onBackClicked = () => {
        history.goBack();
    };

    const onEditClicked = () => {
        history.push(routeTemplateEdit(template.templateId));
    };

    const onCopyClicked = () => {
        const copy = cloneDeep(template);
        copy.templateId = "";
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
            content: "Are you sure you want to delete this template?",
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
        setShareModalVisible(true);
    };

    const onShareClosed = () => {
        setShareModalVisible(false);
    };

    const onShareChange = (shared: boolean) => {
        setTemplate({
            ...template,
            isShared: shared,
        });
        shareTemplate(template.templateId, shared);
    };

    const menu = (
        <Menu>
            <Menu.Item onClick={onCopyClicked}>
                <CopyOutlined /> Copy
            </Menu.Item>
            <Menu.Item onClick={onDeleteClicked}>
                <DeleteOutlined /> Delete
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={onShareClicked}>
                <ShareAltOutlined /> Share
            </Menu.Item>
        </Menu>
    );

    if (!templateLoaded) {
        return (
            // @ts-ignore
            <Layout contentStyle={styles.rootContainer}>
                <Spinner />
            </Layout>
        );
    }

    return (
        // @ts-ignore
        <Layout contentStyle={styles.rootContainer}>
            <div>
                <Card>
                    <Row gutter={[32, 32]} wrap={false}>
                        <Col flex='auto'>
                            <div style={{ marginBottom: 16 }}>
                                {/* @ts-ignore */}
                                <TitleBack
                                    title={`Interview Template - ${template.title}`}
                                    onBackClicked={onBackClicked}
                                />
                            </div>
                            <Text type='secondary'>
                                Use this template to schedule new interview and customize as you go.
                            </Text>
                        </Col>
                        <Col>
                            <TemplateImage interviewType={template.interviewType} />
                        </Col>
                    </Row>

                    <Divider />

                    <div className={styles.divSpaceBetween}>
                        <Button type='primary' onClick={onScheduleInterviewClicked}>
                            Schedule interview
                        </Button>

                        <Dropdown.Button overlay={menu} onClick={onEditClicked}>
                            <EditOutlined /> Edit
                        </Dropdown.Button>
                    </div>
                </Card>
                <Card className={styles.cardSpace}>
                    {/* @ts-ignore */}
                    <IntroSection interview={template} />
                </Card>

                {template.interviewType === InterviewType.INTERVIEW && (
                    <div className={styles.cardSpace}>
                        {/* @ts-ignore */}
                        <TemplateGroupsSection template={template} />
                    </div>
                )}
                {template.interviewType === InterviewType.LIVE_CODING && (
                    <>
                        <div className={styles.cardSpace}>
                            <LiveCodingChallengeCard challenges={template.challenges || []} />
                        </div>
                        <div className={styles.cardSpace}>
                            <LiveCodingAssessmentCard questions={selectAssessmentGroup(template).questions || []} />
                        </div>
                    </>
                )}

                <Card className={styles.cardSpace}>
                    {/* @ts-ignore */}
                    <SummarySection interview={template} />
                </Card>
            </div>
            {/* @ts-ignore */}
            <TemplateShareModal
                shared={template.isShared}
                token={template.token}
                visible={shareModalVisible}
                onShareChange={onShareChange}
                onClose={onShareClosed}
            />
        </Layout>
    );
};

const mapDispatch = { loadTemplates, deleteTemplate, addTemplate, shareTemplate };

const mapState = (state: RootState, ownProps: any) => {
    const templateId = ownProps.match.params.id;

    return {
        originalTemplate: selectTemplate(state.templates, templateId),
    };
};

export default connect(mapState, mapDispatch)(TemplatePreview);
