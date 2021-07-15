import styles from "./interview-schedule.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Card, Col, DatePicker, Divider, Input, message, Modal, Popover, Row, Select, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview, findLibraryTemplate, findTemplate } from "../../components/utils/converters";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_SERVER, Status } from "../../components/utils/constants";
import Layout from "../../components/layout/layout";
import arrayMove from "array-move";
import { InterviewPreviewCard } from "../interview-scorecard/interview-sections";
import {
    addInterview,
    addInterviewWithTemplate,
    loadInterviews,
    updateInterview
} from "../../store/interviews/actions";
import { loadLibrary, loadTemplates } from "../../store/templates/actions";
import TemplateGroupModal from "../template-details/template-group-modal";
import TemplateQuestionsCard from "../template-details/template-questions-card";
import moment from "moment";
import { personalEvent } from "../../analytics";
import { routeInterviews } from "../../components/utils/route";
import { ArrowLeftOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

/**
 *
 * @param {Interview[]} interviews
 * @param {Template[]} templates
 * @param {Template[]} library
 * @param addInterview
 * @param addInterviewWithTemplate
 * @param loadInterviews
 * @param updateInterview
 * @param loadTemplates
 * @param loadLibrary
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewSchedule = ({
    interviews,
    templates,
    library,
    addInterview,
    addInterviewWithTemplate,
    loadInterviews,
    updateInterview,
    loadTemplates,
    loadLibrary,
}) => {

    /**
     *
     * @type {Interview}
     */
    const emptyInterview = {
        interviewId: undefined,
        templateId: undefined,
        libraryId: undefined,
        interviewDateTime: moment().utc().format(DATE_FORMAT_SERVER),
        status: Status.NEW,
        title: "",
        structure: {
            header: "Take 10 minutes to introduce yourself and make the candidate comfortable.",
            footer: "Allow 10 minutes at the end for the candidate to ask questions.",
            groups: [],
        }
    }

    const history = useHistory();

    const { id } = useParams();
    const location = useLocation();

    const candidateComponent = React.createRef();
    const [interview, setInterview] = useState(emptyInterview);
    const [selectedTemplateCollapsed, setSelectedTemplateCollapsed] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [questionGroupModal, setQuestionGroupModal] = useState({
        visible: false,
        name: null,
        id: null
    });

    React.useEffect(() => {
        if (isFromTemplateFlow() && !interview.templateId && templates.length !== 0) {
            const template = cloneDeep(findTemplate(fromTemplateId(), templates))
            setInterview({
                ...interview,
                templateId: template.templateId,
                structure: template.structure
            })
        } else if (isFromLibraryFlow() && !interview.libraryId && library.length !== 0) {
            const template = cloneDeep(findLibraryTemplate(fromLibraryId(), library))
            setInterview({
                ...interview,
                libraryId: template.libraryId,
                structure: template.structure
            })
        } else if (isExistingInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            setInterview(cloneDeep(findInterview(id, interviews)))
        }

        // selected template-details
        if(interview.templateId && templates.length !== 0) {
            const template = cloneDeep(findTemplate(interview.templateId, templates))
            setSelectedTemplate(template)
        } else if(interview.libraryId && library.length !== 0) {
            const template = cloneDeep(findLibraryTemplate(interview.libraryId, library))
            setSelectedTemplate(template)
        }

        // templates selector
        if(templates.length !== 0 || library.length !== 0) {
            const templatesArr = [];
            templates.forEach(template => {
                templatesArr.push({
                    value: template.templateId,
                    label: template.title
                })
            })
            library.forEach(template => {
                templatesArr.push({
                    value: template.libraryId,
                    label: template.title + " (Library Template)"
                })
            })
            setTemplateOptions(templatesArr)
        }

        // eslint-disable-next-line
    }, [interviews, id, templates, library, interview]);

    React.useEffect(() => {
        loadTemplates()
        loadLibrary()

        if (isExistingInterviewFlow()) {
            loadInterviews()
        }
        // eslint-disable-next-line
    }, []);

    const isExistingInterviewFlow = () => id;

    const isFromTemplateFlow = () => fromTemplateId() !== null;

    const isFromLibraryFlow = () => fromLibraryId() !== null;

    const isInitialLoading = () => (isExistingInterviewFlow() && !interview.interviewId)
        || (isFromTemplateFlow() && !interview.templateId)
        || (isFromLibraryFlow() && !interview.libraryId)

    /**
     *
     * @returns {string|null}
     */
    const fromTemplateId = () => {
        const params = new URLSearchParams(location.search);
        return params.get('fromTemplate');
    }

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

    const onCandidateChange = e => {
        interview.candidate = e.target.value
    }

    const onPositionChange = e => {
        interview.position = e.target.value
    }

    const onDateChange = (date) => {
        interview.interviewDateTime = date.utc().format(DATE_FORMAT_SERVER)
    };

    const onQuestionsSortChange = (groupId, questions) => {
        // no need to update state
        interview.structure.groups
            .find(group => group.groupId === groupId).questions = questions
    }

    const onAddQuestionClicked = (groupId) => {
        const questionId = Date.now().toString()
        const updatedInterview = cloneDeep(interview)
        updatedInterview.structure.groups
            .find(group => group.groupId === groupId).questions
            .push({
                questionId: questionId,
                question: "",
                tags: []
            })
        setInterview(updatedInterview)
    }

    const onRemoveQuestionClicked = (questionId) => {
        const updatedInterview = cloneDeep(interview)
        updatedInterview.structure.groups.forEach(group =>
            group.questions = group.questions.filter(q => q.questionId !== questionId)
        )
        setInterview(updatedInterview)
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
        const updatedInterview = cloneDeep(interview)
        updatedInterview.structure.groups = updatedInterview.structure.groups.filter(g => g.groupId !== id)
        setInterview(updatedInterview)
    }

    const onSaveClicked = () => {
        if (isExistingInterviewFlow()) {
            updateInterview(interview);
            message.success(`Interview '${interview.candidate}' updated.`);
        } else if (selectedTemplate.libraryId) {
            const template = {
                ...selectedTemplate,
                structure: interview.structure
            };
            addInterviewWithTemplate(interview, template);
            personalEvent('Interview created');
            message.success(`Interview '${interview.candidate}' created.`);
        } else {
            addInterview(interview);
            personalEvent('Interview created');
            message.success(`Interview '${interview.candidate}' created.`);
        }
        history.push(routeInterviews())
    }

    const onHeaderChanged = e => {
        interview.structure.header = e.target.value
    }

    const onFooterChanged = e => {
        interview.structure.footer = e.target.value
    }

    const onGroupModalCancel = () => {
        setQuestionGroupModal({
            ...questionGroupModal,
            visible: false
        })
    }

    const onGroupModalUpdate = (id, name) => {
        const updatedInterview = cloneDeep(interview)
        updatedInterview.structure.groups
            .find(group => group.groupId === id)
            .name = name
        setInterview(updatedInterview)
        setQuestionGroupModal(false)
    }

    const onGroupModalAdd = name => {
        const groupId = Date.now().toString()
        const updatedInterview = cloneDeep(interview)
        updatedInterview.structure.groups.push({
            groupId: groupId,
            name: name,
            questions: []
        })
        setInterview(updatedInterview)
        setQuestionGroupModal(false)
    }

    const onMoveGroupUpClicked = id => {
        const updatedInterview = cloneDeep(interview)
        const fromIndex = updatedInterview.structure.groups.findIndex(g => g.groupId === id)
        const toIndex = fromIndex - 1
        updatedInterview.structure.groups = arrayMove(updatedInterview.structure.groups, fromIndex, toIndex)
        setInterview(updatedInterview)
    }

    const onMoveGroupDownClicked = id => {
        const updatedInterview = cloneDeep(interview)
        const fromIndex = updatedInterview.structure.groups.findIndex(g => g.groupId === id)
        const toIndex = fromIndex + 1
        updatedInterview.structure.groups = arrayMove(updatedInterview.structure.groups, fromIndex, toIndex)
        setInterview(updatedInterview)
    }

    const onPreviewClosed = () => {
        setPreviewModalVisible(false)
    };

    const onPreviewClicked = () => {
        setPreviewModalVisible(true)
    }

    const onTemplateSelect = (value) => {
        let personalTemplate = templates.find(template => template.templateId === value)
        let libraryTemplate = library.find(template => template.libraryId === value)

        if(personalTemplate) {
            setInterview({
                ...interview,
                templateId: personalTemplate.templateId,
                structure: cloneDeep(personalTemplate.structure)
            })
            setSelectedTemplate(personalTemplate)
            setSelectedTemplateCollapsed(true)
        } else if(libraryTemplate) {
            setInterview({
                ...interview,
                libraryId: libraryTemplate.libraryId,
                structure: cloneDeep(libraryTemplate.structure)
            })
            setSelectedTemplate(libraryTemplate)
            setSelectedTemplateCollapsed(true)
        } else {
            setInterview({
                ...interview,
                libraryId: null,
                templateId: null,
                structure: []
            })
            setSelectedTemplate(null)
            setSelectedTemplateCollapsed(true)
        }
    }

    const onCollapseClicked = () => {
        setSelectedTemplateCollapsed(!selectedTemplateCollapsed)
    }

    const onCreateTemplateClicked = () => {
        candidateComponent.current.focus() // removes focus from Template select dropdown
        setInterview({
            ...interview,
            libraryId: null,
            templateId: null,
            structure: {
                header: "Take 10 minutes to introduce yourself and make the candidate comfortable.",
                footer: "Allow 10 minutes at the end for the candidate to ask questions.",
                groups: [],
            }
        })
        setSelectedTemplate({
            title: "New"
        })
        setSelectedTemplateCollapsed(false)
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
                <Card style={marginTop12} key={interview.interviewId} loading={isInitialLoading()}>
                    <div className={styles.header} style={{marginBottom: 12}}>
                        <div className={styles.headerTitleContainer} onClick={onBackClicked}>
                            <ArrowLeftOutlined /> <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>Schedule Interview</Title>
                        </div>
                    </div>
                    <Text type="secondary">Enter interview details information so you can easily discover it among other interviews.</Text>
                    <div className={styles.divSpaceBetween}>
                        <Space direction="vertical" className={styles.fillWidth} style={{ marginRight: 16 }}>
                            <Text strong>Template</Text>
                            <Select
                                showSearch
                                allowClear
                                className={styles.fillWidth}
                                placeholder="Select template"
                                onChange={onTemplateSelect}
                                options={templateOptions}
                                defaultValue={interview.templateId || interview.libraryId}
                                filterOption={(inputValue, option) =>
                                    option.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
                                }
                                notFoundContent={
                                    <Space direction="vertical">
                                        <Text>No template found.</Text>
                                        <Button
                                            onClick={onCreateTemplateClicked}
                                            style={{padding: 0}}
                                            type="link">Create a template</Button>
                                    </Space>
                                }
                            />
                        </Space>
                        <Space direction="vertical" className={styles.fillWidth}>
                            <Text strong>Candidate</Text>
                            <Input
                                ref={candidateComponent}
                                placeholder="e.g. Kristin Watson"
                                onChange={onCandidateChange}
                                defaultValue={interview.candidate}
                            />
                        </Space>
                    </div>
                    <div className={styles.divSpaceBetween}>
                        <Space direction="vertical" className={styles.fillWidth} style={{ marginRight: 16 }}>
                            <Text strong>Interview Date</Text>
                            <DatePicker showTime
                                        allowClear={false}
                                        format={DATE_FORMAT_DISPLAY}
                                        className={styles.fillWidth}
                                        defaultValue={interview.interviewDateTime ? moment(interview.interviewDateTime) : moment()}
                                        onChange={onDateChange}
                            />
                        </Space>
                        <Space direction="vertical" className={styles.fillWidth}>
                            <Text strong>Position</Text>
                            <Input
                                placeholder="e.g. Junior Software Developer"
                                defaultValue={interview.position}
                                onChange={onPositionChange}
                            />
                        </Space>
                    </div>

                    <Divider />
                    <div className={styles.divSpaceBetween}>
                        <Text />
                        <Space>
                            <Button onClick={onPreviewClicked}>Preview</Button>
                            <Button
                                type="primary"
                                onClick={onSaveClicked}>Save</Button>
                        </Space>
                    </div>
                </Card>

                {selectedTemplate && <Card style={marginTop12} loading={isInitialLoading()}>
                    <Space direction="vertical">
                        <Title level={4} style={{margin: 0}}>Template - {selectedTemplate.title}</Title>
                        <Text type="secondary">Customize an interview template to match any of your processes.</Text>

                        {selectedTemplateCollapsed && <Button onClick={onCollapseClicked}>Show template details</Button>}
                        {!selectedTemplateCollapsed && <Button onClick={onCollapseClicked}>Hide template details</Button>}
                    </Space>
                </Card>}

                {!selectedTemplateCollapsed && <div>
                    <Card style={marginTop12} loading={isInitialLoading()}>
                        <Title level={4}>Intro</Title>
                        <Text type="secondary">This section serves as a reminder for what interviewer must do at the
                            beginning of the interview.</Text>
                        <TextArea
                            style={marginTop16}
                            defaultValue={interview.structure.header}
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
                                     src={process.env.PUBLIC_URL + '/app/interview-schedule-groups.png'} />
                            }>
                                <InfoCircleOutlined style={{ marginBottom: 12, cursor: 'pointer' }} />
                            </Popover>
                        </Space>
                        <Text type="secondary">Grouping questions helps to evaluate skills in a particular competence area
                            and make a more granular assessment.</Text>
                        <div>
                            {interview.structure.groups.map(group =>
                                <TemplateQuestionsCard
                                    template={interview}
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
                        <Title level={4}>End of interview</Title>
                        <Text type="secondary">This section serves as a reminder for what interviewer must do at the
                            end of the interview. It also contains fields to take notes and make a final assessment.</Text>
                        <TextArea
                            style={marginTop16}
                            defaultValue={interview.structure.footer}
                            onChange={onFooterChanged}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            placeholder="Allow 10 minutes at the end for the candidate to ask questions." />
                    </Card>
                </div>}
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
            <InterviewPreviewCard interview={interview} onCloseClicked={onPreviewClosed} />
        </Modal>
    </Layout>
}

const mapDispatch = { addInterview, addInterviewWithTemplate, loadInterviews, updateInterview, loadTemplates, loadLibrary };
const mapState = (state) => {
    const interviewState = state.interviews || {};
    const templateState = state.templates || {};

    return {
        interviews: interviewState.interviews,
        templates: templateState.templates,
        library: templateState.library,
    }
}

export default connect(mapState, mapDispatch)(InterviewSchedule)