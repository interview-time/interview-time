import styles from "./template.module.css";
import React, { useState } from "react";
import {
    addTemplate,
    loadLibrary,
    loadSharedTemplate,
    loadTemplates,
    updateTemplate,
} from "../../store/templates/actions";
import { connect } from "react-redux";
import { Button, Col, Divider, Form, Input, message, Modal, Popover, Row, Select, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findLibraryTemplate, findTemplate } from "../../components/utils/converters";
import { TemplateCategories } from "../../components/utils/constants";
import TemplateQuestionsCard from "./template-questions-card";
import Layout from "../../components/layout/layout";
import { personalEvent } from "../../analytics";
import { routeTemplates } from "../../components/utils/route";
import TemplateGroupModal from "./template-group-modal";
import arrayMove from "array-move";
import { TemplateDetailsPreviewCard } from "../interview-scorecard/interview-sections";
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { filterOptionLabel } from "../../components/utils/filters";
import Card from "../../components/card/card";
import Spinner from "../../components/spinner/spinner";
import TemplateImage from "../../components/template-card/template-image";
import TitleBack from "../../components/title/title-back";

const { TextArea } = Input;

/**
 *
 * @param {Template[]} templates
 * @param {Template[]} library
 * @param {Template} sharedTemplate
 * @param addTemplate
 * @param loadTemplates
 * @param loadLibrary
 * @param updateTemplate
 * @param loadSharedTemplate
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateEdit = ({
    templates,
    library,
    sharedTemplate,
    addTemplate,
    loadTemplates,
    loadLibrary,
    updateTemplate,
    loadSharedTemplate,
}) => {
    const templateCategories = TemplateCategories.map(category => ({
        value: category.key,
        label: category.title,
    }));
    const history = useHistory();

    const { id } = useParams();
    const location = useLocation();

    const [template, setTemplate] = useState();
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [questionGroupModal, setQuestionGroupModal] = useState({
        visible: false,
        name: null,
        id: null,
    });

    React.useEffect(() => {
        if (isExistingTemplateFlow() && templates.length !== 0) {
            setTemplate(cloneDeep(findTemplate(id, templates)));
        } else if (isFromLibraryFlow() && library.length !== 0) {
            let parent = cloneDeep(findLibraryTemplate(fromLibraryId(), library));
            setTemplate({
                ...template,
                parentId: fromLibraryId(),
                title: parent.title,
                type: parent.type,
                structure: parent.structure,
            });
        } else if (sharedTemplateToken() && sharedTemplate) {
            setTemplate(cloneDeep(sharedTemplate));
        }
        // eslint-disable-next-line
    }, [templates, library, id, sharedTemplate]);

    React.useEffect(() => {
        if (isExistingTemplateFlow()) {
            loadTemplates();
        } else if (isFromLibraryFlow()) {
            loadLibrary();
        } // blank template
        else if (sharedTemplateToken()) {
            loadSharedTemplate(sharedTemplateToken());
        } else {
            setTemplate({
                templateId: undefined,
                title: "",
                structure: {
                    groups: [],
                },
            });
        }

        // eslint-disable-next-line
    }, []);

    const isExistingTemplateFlow = () => id;

    const isFromLibraryFlow = () => fromLibraryId() !== null;

    /**
     *
     * @returns {string|null}
     */
    const fromLibraryId = () => {
        const params = new URLSearchParams(location.search);
        return params.get("fromLibrary");
    };

    const sharedTemplateToken = () => {
        const params = new URLSearchParams(location.search);
        return params.get("sharedTemplateToken");
    };

    const onBackClicked = () => {
        history.goBack();
    };

    const onCategoryChange = value => {
        setTemplate({
            ...template,
            type: value,
        });
    };

    const onTitleChange = e => {
        template.title = e.target.value;
    };

    const onDescriptionChange = e => {
        template.description = e.target.value;
    };

    const onGroupTitleClicked = (id, name) => {
        setQuestionGroupModal({
            visible: true,
            name: name,
            id: id,
        });
    };

    const onAddQuestionGroupClicked = () => {
        setQuestionGroupModal({
            visible: true,
            name: null,
            id: null,
        });
    };

    const onDeleteGroupClicked = id => {
        const updatedTemplate = cloneDeep(template);
        updatedTemplate.structure.groups = updatedTemplate.structure.groups.filter(g => g.groupId !== id);
        setTemplate(updatedTemplate);
    };

    const onSaveClicked = () => {
        if (isExistingTemplateFlow()) {
            updateTemplate(template);
            message.success(`Template '${template.title}' updated.`);
        } else {
            personalEvent("Template created");
            addTemplate(template);
            message.success(`Template '${template.title}' created.`);
        }
        history.push(routeTemplates());
    };

    const onHeaderChanged = e => {
        template.structure.header = e.target.value;
    };

    const onFooterChanged = e => {
        template.structure.footer = e.target.value;
    };

    const onGroupModalCancel = () => {
        setQuestionGroupModal({
            ...questionGroupModal,
            visible: false,
        });
    };

    const onGroupModalUpdate = (id, name) => {
        const updatedTemplate = cloneDeep(template);
        updatedTemplate.structure.groups.find(group => group.groupId === id).name = name;
        setTemplate(updatedTemplate);
        setQuestionGroupModal(false);
    };

    const onGroupModalAdd = name => {
        const groupId = Date.now().toString();
        const updatedTemplate = cloneDeep(template);
        updatedTemplate.structure.groups.push({
            groupId: groupId,
            name: name,
            questions: [],
        });
        setTemplate(updatedTemplate);
        setQuestionGroupModal(false);
    };

    const onMoveGroupUpClicked = id => {
        const updatedTemplate = cloneDeep(template);
        const fromIndex = updatedTemplate.structure.groups.findIndex(g => g.groupId === id);
        const toIndex = fromIndex - 1;
        updatedTemplate.structure.groups = arrayMove(updatedTemplate.structure.groups, fromIndex, toIndex);
        setTemplate(updatedTemplate);
    };

    const onMoveGroupDownClicked = id => {
        const updatedTemplate = cloneDeep(template);
        const fromIndex = updatedTemplate.structure.groups.findIndex(g => g.groupId === id);
        const toIndex = fromIndex + 1;
        updatedTemplate.structure.groups = arrayMove(updatedTemplate.structure.groups, fromIndex, toIndex);
        setTemplate(updatedTemplate);
    };

    const onPreviewClosed = () => {
        setPreviewModalVisible(false);
    };

    const onPreviewClicked = () => {
        setPreviewModalVisible(true);
    };

    const marginTop12 = { marginTop: 12 };
    const marginTop16 = { marginTop: 16 };

    return (
        <Layout contentStyle={styles.rootContainer}>
            {template ? (
                <>
                    <Form
                        name='basic'
                        layout='vertical'
                        initialValues={{
                            title: template.title,
                            category: template.type,
                            description: template.description,
                        }}
                        onFinish={onSaveClicked}
                    >
                        <Card>
                            <Row gutter={[32, 32]} wrap={false}>
                                <Col flex='auto'>
                                    <div style={{ marginBottom: 16 }}>
                                        <TitleBack title="Interview Template" onBackClicked={onBackClicked} />
                                    </div>
                                    <Text type='secondary'>
                                        Enter template detail information so you can easily discover it among other
                                        templates.
                                    </Text>
                                </Col>
                                <Col>
                                    <TemplateImage templateType={template.type} />
                                </Col>
                            </Row>
                            <Row gutter={[32, 32]} style={marginTop16}>
                                <Col span={12}>
                                    <Form.Item
                                        name='title'
                                        label={<Text strong>Title</Text>}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter template-edit title",
                                            },
                                        ]}
                                    >
                                        <Input placeholder='e.g. Android' onChange={onTitleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name='category'
                                        label={<Text strong>Category</Text>}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please choose template-edit category",
                                            },
                                        ]}
                                    >
                                        <Select
                                            style={{ width: "100%" }}
                                            placeholder='Select category'
                                            onSelect={onCategoryChange}
                                            options={templateCategories}
                                            showSearch
                                            filterOption={filterOptionLabel}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[32, 32]}>
                                <Col span={12}>
                                    <Form.Item name='description' label={<Text strong>Description</Text>}>
                                        <Input
                                            placeholder='e.g. Entry-level software engineer'
                                            onChange={onDescriptionChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card className={styles.cardSpace}>
                            <Title level={4}>Intro</Title>
                            <Text type='secondary'>
                                Intro section serves as a reminder for what interviewer should do at the beginning of
                                the interview.
                            </Text>
                            <TextArea
                                style={marginTop16}
                                defaultValue={template.structure.header}
                                onChange={onHeaderChanged}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                placeholder='Take 10 minutes to introduce yourself and make the candidate comfortable.'
                            />
                        </Card>

                        <Card className={styles.cardSpace}>
                            <Space style={{ width: "100%" }}>
                                <Title level={4}>Questions</Title>
                                <Popover
                                    content={
                                        <img
                                            alt='Interviewer'
                                            style={{ width: 400 }}
                                            src={process.env.PUBLIC_URL + "/app/interview-schedule-groups.png"}
                                        />
                                    }
                                >
                                    <InfoCircleOutlined style={{ marginBottom: 12, cursor: "pointer" }} />
                                </Popover>
                            </Space>
                            <Text type='secondary'>
                                Grouping questions helps to evaluate skills in a particular competence area and make a
                                more granular assessment.
                            </Text>
                            <div>
                                {template.structure.groups.map(group => (
                                    <TemplateQuestionsCard
                                        template={template}
                                        group={group}
                                        onGroupTitleClicked={onGroupTitleClicked}
                                        onDeleteGroupClicked={onDeleteGroupClicked}
                                        onMoveGroupUpClicked={onMoveGroupUpClicked}
                                        onMoveGroupDownClicked={onMoveGroupDownClicked}
                                    />
                                ))}
                            </div>
                            <Button
                                style={marginTop12}
                                icon={<PlusOutlined />}
                                type='primary'
                                ghost
                                onClick={onAddQuestionGroupClicked}
                            >
                                New question group
                            </Button>
                        </Card>

                        <Card className={styles.cardSpace}>
                            <Title level={4}>End of interview</Title>
                            <Text type='secondary'>
                                This section serves as a reminder for what interviewer should do at the end of the
                                interview.
                            </Text>
                            <TextArea
                                style={marginTop12}
                                defaultValue={template.structure.footer}
                                onChange={onFooterChanged}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                placeholder='Allow 10 minutes at the end for the candidate to ask questions.'
                            />
                            <Divider />

                            <div className={styles.divSpaceBetween}>
                                <Text />
                                <Space>
                                    <Button onClick={onPreviewClicked}>Preview</Button>
                                    <Button type='primary' htmlType='submit'>
                                        Save template
                                    </Button>
                                </Space>
                            </div>
                        </Card>
                    </Form>

                    <TemplateGroupModal
                        visible={questionGroupModal.visible}
                        name={questionGroupModal.name}
                        id={questionGroupModal.id}
                        onCancel={onGroupModalCancel}
                        onAdd={onGroupModalAdd}
                        onUpdate={onGroupModalUpdate}
                    />

                    <Modal
                        title={null}
                        footer={null}
                        closable={false}
                        destroyOnClose={true}
                        width='80%'
                        style={{ top: "5%" }}
                        bodyStyle={{ backgroundColor: "#F9FAFB" }}
                        onCancel={onPreviewClosed}
                        visible={previewModalVisible}
                    >
                        <TemplateDetailsPreviewCard template={template} onCloseClicked={onPreviewClosed} />
                    </Modal>
                </>
            ) : (
                <Spinner />
            )}
        </Layout>
    );
};

const mapDispatch = { addTemplate, loadTemplates, loadLibrary, updateTemplate, loadSharedTemplate };
const mapState = state => {
    const templateState = state.templates || {};

    return {
        templates: templateState.templates,
        library: templateState.library,
        sharedTemplate: templateState.sharedTemplate,
    };
};

export default connect(mapState, mapDispatch)(TemplateEdit);
