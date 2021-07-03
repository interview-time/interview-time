import styles from "./template.module.css";
import React, { useState } from "react";
import { addTemplate, loadLibrary, loadTemplates, updateTemplate } from "../../store/templates/actions";
import { connect } from "react-redux";
import { Button, Card, Col, Divider, Input, message, Modal, Popover, Row, Select, Space } from "antd";
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
import { ArrowLeftOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

/**
 *
 * @param {Template[]} templates
 * @param {Template[]} library
 * @param addTemplate
 * @param loadTemplates
 * @param loadLibrary
 * @param updateTemplate
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateDetails = ({
    templates,
    library,
    addTemplate,
    loadTemplates,
    loadLibrary,
    updateTemplate
}) => {

    /**
     *
     * @type {Template}
     */
    const emptyTemplate = {
        templateId: undefined,
        title: "",
        structure: {
            header: "Take 10 minutes to introduce yourself and make the candidate comfortable.",
            footer: "Allow 10 minutes at the end for the candidate to ask questions.",
            groups: [],
        }
    }

    const templateCategories = TemplateCategories.map(category => ({
        value: category.key,
        label: category.title,
    }))
    const history = useHistory();

    const { id } = useParams();
    const location = useLocation();

    const [template, setTemplate] = useState(emptyTemplate);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [questionGroupModal, setQuestionGroupModal] = useState({
        visible: false,
        name: null,
        id: null
    });

    React.useEffect(() => {
        if (isExistingTemplateFlow() && !template.templateId && templates.length !== 0) {
            setTemplate(cloneDeep(findTemplate(id, templates)))
        } else if (isFromLibraryFlow() && !template.parentId && library.length !== 0) {
            let parent = cloneDeep(findLibraryTemplate(fromLibraryId(), library))
            setTemplate({
                ...template,
                parentId: fromLibraryId(),
                title: parent.title,
                structure: parent.structure,
            })
        }
        // eslint-disable-next-line
    }, [templates, library, id]);

    React.useEffect(() => {
        if (isExistingTemplateFlow()) {
            loadTemplates()
        } else if(isFromLibraryFlow()) {
            loadLibrary()
        }

        // eslint-disable-next-line
    }, []);

    const isExistingTemplateFlow = () => id;

    const isFromLibraryFlow = () => fromLibraryId() !== null;

    const isInitialLoading = () => (isExistingTemplateFlow() && !template.templateId)
        || (isFromLibraryFlow() && !template.parentId)

    /**
     *
     * @returns {string|null}
     */
    const fromLibraryId = () => {
        const params = new URLSearchParams(location.search);
        return params.get('fromLibrary');
    }

    const onBackClicked = () => {
        history.goBack()
    }

    const onCategoryChange = value => {
        template.type = value;
    }

    const onTitleChange = e => {
        template.title = e.target.value
    }

    const onQuestionsSortChange = (groupId, questions) => {
        // no need to update state
        template.structure.groups
            .find(group => group.groupId === groupId).questions = questions
    }

    const onAddQuestionClicked = (groupId) => {
        const questionId = Date.now().toString()
        const updatedTemplate = cloneDeep(template)
        updatedTemplate.structure.groups
            .find(group => group.groupId === groupId).questions
            .push({
                questionId: questionId,
                question: "",
                tags: []
            })
        setTemplate(updatedTemplate)
    }

    const onRemoveQuestionClicked = (questionId) => {
        const updatedTemplate = cloneDeep(template)
        updatedTemplate.structure.groups.forEach(group =>
            group.questions = group.questions.filter(q => q.questionId !== questionId)
        )
        setTemplate(updatedTemplate)
    }

    const onGroupTitleClicked = (id, name) => {
        setQuestionGroupModal({
            visible: true,
            name: name,
            id: id
        })
    }

    const onAddQuestionGroupClicked = () => {
        setQuestionGroupModal({
            visible: true,
            name: null,
            id: null
        })
    }

    const onDeleteGroupClicked = id => {
        const updatedTemplate = cloneDeep(template)
        updatedTemplate.structure.groups = updatedTemplate.structure.groups.filter(g => g.groupId !== id)
        setTemplate(updatedTemplate)
    }

    const onSaveClicked = () => {
        if (isExistingTemplateFlow()) {
            updateTemplate(template);
            message.success(`Template '${template.title}' updated.`);
        } else {
            personalEvent('Template created');
            addTemplate(template);
            message.success(`Template '${template.title}' created.`);
        }
        history.push(routeTemplates())
    }

    const onHeaderChanged = e => {
        template.structure.header = e.target.value
    }

    const onFooterChanged = e => {
        template.structure.footer = e.target.value
    }

    const onGroupModalCancel = () => {
        setQuestionGroupModal({
            ...questionGroupModal,
            visible: false
        })
    }

    const onGroupModalUpdate = (id, name) => {
        const updatedTemplate = cloneDeep(template)
        updatedTemplate.structure.groups
            .find(group => group.groupId === id)
            .name = name
        setTemplate(updatedTemplate)
        setQuestionGroupModal(false)
    }

    const onGroupModalAdd = name => {
        const groupId = Date.now().toString()
        const updatedTemplate = cloneDeep(template)
        updatedTemplate.structure.groups.push({
            groupId: groupId,
            name: name,
            questions: []
        })
        setTemplate(updatedTemplate)
        setQuestionGroupModal(false)
    }

    const onMoveGroupUpClicked = id => {
        const updatedTemplate = cloneDeep(template)
        const fromIndex = updatedTemplate.structure.groups.findIndex(g => g.groupId === id)
        const toIndex = fromIndex - 1
        updatedTemplate.structure.groups = arrayMove(updatedTemplate.structure.groups, fromIndex, toIndex)
        setTemplate(updatedTemplate)
    }

    const onMoveGroupDownClicked = id => {
        const updatedTemplate = cloneDeep(template)
        const fromIndex = updatedTemplate.structure.groups.findIndex(g => g.groupId === id)
        const toIndex = fromIndex + 1
        updatedTemplate.structure.groups = arrayMove(updatedTemplate.structure.groups, fromIndex, toIndex)
        setTemplate(updatedTemplate)
    }

    const onPreviewClosed = () => {
        setPreviewModalVisible(false)
    };

    const onPreviewClicked = () => {
        setPreviewModalVisible(true)
    }

    const marginTop12 = { marginTop: 12 };
    const marginVertical12 = { marginTop: 12, marginBottom: 12 };
    const marginTop16 = { marginTop: 16 };

    return <Layout>
        <Row className={styles.rootContainer}>
            <Col
                xxl={{ span: 16, offset: 4 }}
                xl={{ span: 16, offset: 4 }}
                lg={{ span: 20, offset: 2 }}
                md={{ span: 24 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
            >
                <Card style={marginTop12} key={template.templateId} loading={isInitialLoading()}>
                    <div className={styles.header} style={{marginBottom: 12}}>
                        <div className={styles.headerTitleContainer} onClick={onBackClicked}>
                            <ArrowLeftOutlined /> <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>Interview
                            Template</Title>
                        </div>
                    </div>
                    <Text type="secondary">Enter template detail information so you can easily discover it among other
                        templates.</Text>
                    <div className={styles.divSpaceBetween}>
                        <Space direction="vertical" className={styles.divFlexGrow} style={{ marginRight: 16 }}>
                            <Text strong>Title</Text>
                            <Input
                                placeholder="e.g. Software Developer"
                                onChange={onTitleChange}
                                defaultValue={template.title}
                            />
                        </Space>
                        <Space direction="vertical" className={styles.divFlexGrow}>
                            <Text strong>Category</Text>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select category"
                                defaultValue={template.type}
                                onSelect={onCategoryChange}
                                options={templateCategories}
                                showSearch
                                filterOption={(inputValue, option) =>
                                    option.value.toLocaleLowerCase().includes(inputValue)
                                }
                            />
                        </Space>
                    </div>
                </Card>

                <Card style={marginTop12} loading={isInitialLoading()}>
                    <Title level={4}>Intro</Title>
                    <Text type="secondary">Intro section serves as a reminder for what interviewer must do at the
                        beginning of the interview.</Text>
                    <TextArea
                        style={marginTop16}
                        defaultValue={template.structure.header}
                        onChange={onHeaderChanged}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
                </Card>

                <Card style={marginTop12} loading={isInitialLoading()}>
                    <Space style={{ width: '100%' }}>
                        <Title level={4}>Questions</Title>
                        <Popover content={
                            <img alt="Interviewer"
                                 style={{ width: 400 }}
                                 src={process.env.PUBLIC_URL + '/app/interview-groups.png'} />
                        }>
                            <InfoCircleOutlined style={{ marginBottom: 12, cursor: 'pointer' }} />
                        </Popover>
                    </Space>
                    <Text type="secondary">Grouping questions helps to evaluate skills in a particular competence area
                        and make a more granular assessment.</Text>
                    <div>
                        {template.structure.groups.map(group =>
                            <TemplateQuestionsCard
                                template={template}
                                group={group}
                                onQuestionsSortChange={onQuestionsSortChange}
                                onAddQuestionClicked={onAddQuestionClicked}
                                onRemoveQuestionClicked={onRemoveQuestionClicked}
                                onGroupTitleClicked={onGroupTitleClicked}
                                onDeleteGroupClicked={onDeleteGroupClicked}
                                onMoveGroupUpClicked={onMoveGroupUpClicked}
                                onMoveGroupDownClicked={onMoveGroupDownClicked}
                            />
                        )}
                    </div>
                    <Button style={marginTop12}
                            icon={<PlusOutlined />}
                            type="primary"
                            ghost
                            onClick={onAddQuestionGroupClicked}>New question group</Button>
                </Card>

                <Card style={marginVertical12} loading={isInitialLoading()}>
                    <Title level={4}>Summary</Title>
                    <Text type="secondary">The summary section serves as a reminder for what interviewer must do at the
                        end of the interview. It also contains fields to take notes and make a final assessment.</Text>
                    <TextArea
                        style={marginTop16}
                        defaultValue={template.structure.footer}
                        onChange={onFooterChanged}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder="Allow 10 minutes at the end for the candidate to ask questions." />
                    <Divider />

                    <div className={styles.divSpaceBetween}>
                        <Text />
                        <Space>
                            <Button onClick={onPreviewClicked}>Interview experience</Button>
                            <Button type="primary" onClick={onSaveClicked}>Save template</Button>
                        </Space>
                    </div>
                </Card>
            </Col>
        </Row>

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
            width={1000}
            style={{ top: '5%' }}
            bodyStyle={{backgroundColor: '#EEF0F2F5' }}
            onCancel={onPreviewClosed}
            visible={previewModalVisible}>
            <TemplateDetailsPreviewCard template={template} onCloseClicked={onPreviewClosed} />
        </Modal>
    </Layout>
}

const mapDispatch = { addTemplate, loadTemplates, loadLibrary, updateTemplate };
const mapState = (state) => {
    const templateState = state.templates || {};

    return {
        templates: templateState.templates,
        library: templateState.library
    }
}

export default connect(mapState, mapDispatch)(TemplateDetails)