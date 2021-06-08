import styles from "./template.module.css";
import React, { useState } from "react";
import { loadQuestionBank } from "../../store/question-bank/actions";
import { addTemplate, loadTemplates, updateTemplate } from "../../store/templates/actions";
import { connect } from "react-redux";
import { Button, Card, Col, Divider, Input, message, Row, Select, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findTemplate } from "../../components/utils/converters";
import { TemplateCategories } from "../../components/utils/constants";
import TemplateQuestionsCard from "./template-questions-card";
import Layout from "../../components/layout/layout";
import { personalEvent } from "../../analytics";
import { routeTemplates } from "../../components/utils/route";
import TemplateGroupModal from "./template-group-modal";
import arrayMove from "array-move";

const { TextArea } = Input;

const TemplateDetails = ({
    templates,
    loading,
    addTemplate,
    loadTemplates,
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

    const [template, setTemplate] = useState(emptyTemplate);
    const [questionGroupModal, setQuestionGroupModal] = useState({
        visible: false,
        name: null,
        id: null
    });

    React.useEffect(() => {
        if (!isNewTemplateFlow() && !template.templateId && templates.length !== 0) {
            setTemplate(cloneDeep(findTemplate(id, templates)))
        }
        // eslint-disable-next-line
    }, [templates, id]);

    React.useEffect(() => {
        if (!isNewTemplateFlow()) {
            loadTemplates()
        }

        loadQuestionBank()
        // eslint-disable-next-line
    }, []);

    const isNewTemplateFlow = () => !id;

    const onCategoryChange = value => {
        template.type = value;
    }

    const onTitleChange = e => {
        template.title = e.target.value
    }

    const onQuestionsSortChange = (groupId, questions) => {
        const updatedTemplate = cloneDeep(template)
        updatedTemplate.structure.groups
            .find(group => group.groupId === groupId).questions = questions
        setTemplate(updatedTemplate)
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
        if (isNewTemplateFlow()) {
            personalEvent('Template created');
            addTemplate(template);
            message.success(`Template '${template.title}' created.`);
        } else {
            updateTemplate(template);
            message.success(`Template '${template.title}' updated.`);
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

    const margin24 = { marginTop: 24 };
    const margin16 = { marginTop: 16 };

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
                <Card style={margin24} key={template.templateId}>
                    <Title level={4}>Interview Template</Title>
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

                <Card style={margin24}>
                    <Title level={4}>Intro</Title>
                    <Text type="secondary">Intro section serves as a reminder for what interviewer must do at the
                        beginning of the interview.</Text>
                    <TextArea
                        style={margin16}
                        defaultValue={template.structure.header}
                        onChange={onHeaderChanged}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
                </Card>

                <Card style={margin24}>
                    <Title level={4}>Questions</Title>
                    <Text type="secondary">Grouping questions helps to evaluate skills in a particular competence area
                        and make a
                        more granular assessment.</Text>
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
                    <Button style={margin24} onClick={onAddQuestionGroupClicked}>Add Question Group</Button>
                </Card>

                <Card style={margin24}>
                    <Title level={4}>Summary</Title>
                    <Text type="secondary">The summary section serves as a reminder for what interviewer must do at the
                        end of the interview. It also contains fields to take notes and make a final assessment.</Text>
                    <TextArea
                        style={margin16}
                        defaultValue={template.structure.footer}
                        onChange={onFooterChanged}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder="Allow 10 minutes at the end for the candidate to ask questions." />
                    <Divider />

                    <div className={styles.divSpaceBetween}>
                        <Button>Back</Button>
                        <Space>
                            <Button type="primary">Interview Preview</Button>
                            <Button type="primary" onClick={onSaveClicked}>Save</Button>
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
    </Layout>
}

const mapDispatch = { addTemplate, loadTemplates, updateTemplate };
const mapState = (state) => {
    const templateState = state.templates || {};

    return {
        templates: templateState.templates,
        loading: templateState.loading
    }
}

export default connect(mapState, mapDispatch)(TemplateDetails)