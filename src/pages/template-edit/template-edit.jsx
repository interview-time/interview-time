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
import { Button, Form, message, Modal } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findLibraryTemplate, findTemplate } from "../../components/utils/converters";
import Layout from "../../components/layout/layout";
import { personalEvent } from "../../analytics";
import { routeTemplates } from "../../components/utils/route";
import TemplateGroupModal from "./template-group-modal";
import arrayMove from "array-move";
import { TemplateDetailsPreviewCard } from "../interview-scorecard/interview-sections";
import { PlusOutlined } from "@ant-design/icons";
import Card from "../../components/card/card";
import Spinner from "../../components/spinner/spinner";
import TemplateMetaCard from "./template-meta-card";
import TemplateHeaderCard from "./template-header-card";
import TemplateFooterCard from "./template-footer-card";
import TemplateQuestionsCard from "./template-questions-card";

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
    const history = useHistory();

    const { id } = useParams();
    const location = useLocation();

    const [template, setTemplate] = useState(/** @type {Template|undefined} */);
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

    // MARK: Template metadata

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

    // MARK: Reminders

    const onHeaderChanged = e => {
        template.structure.header = e.target.value;
    };

    const onFooterChanged = e => {
        template.structure.footer = e.target.value;
    };

    // MARK: Groups management

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
        // TODO no need to copy
        const updatedTemplate = cloneDeep(template);
        updatedTemplate.structure.groups = updatedTemplate.structure.groups.filter(g => g.groupId !== id);
        setTemplate(updatedTemplate);
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

    // MARK: Preview

    const onPreviewClosed = () => {
        setPreviewModalVisible(false);
    };

    const onPreviewClicked = () => {
        setPreviewModalVisible(true);
    };

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
                        <TemplateMetaCard
                            templateType={template.type}
                            onBackClicked={onBackClicked}
                            onTitleChange={onTitleChange}
                            onCategoryChange={onCategoryChange}
                            onDescriptionChange={onDescriptionChange}
                        />

                        <TemplateHeaderCard header={template.structure.header} onHeaderChanged={onHeaderChanged} />

                        <Card className={styles.cardSpace}>
                            <Title level={4}>Questions</Title>
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
                                style={{ marginTop: 12 }}
                                icon={<PlusOutlined />}
                                type='primary'
                                ghost
                                onClick={onAddQuestionGroupClicked}
                            >
                                New question group
                            </Button>
                        </Card>

                        <TemplateFooterCard
                            footer={template.structure.footer}
                            onFooterChanged={onFooterChanged}
                            onPreviewClicked={onPreviewClicked}
                        />
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
