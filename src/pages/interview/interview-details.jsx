import styles from "./interview.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Card, Col, DatePicker, Divider, Input, message, Modal, Popover, Row, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview, findLibraryTemplate, findTemplate } from "../../components/utils/converters";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_SERVER, Status } from "../../components/utils/constants";
import Layout from "../../components/layout/layout";
import arrayMove from "array-move";
import { InterviewPreviewCard } from "../interview-scorecard/interview-sections";
import { addInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { loadLibrary, loadTemplates } from "../../store/templates/actions";
import TemplateGroupModal from "../template/template-group-modal";
import TemplateQuestionsCard from "../template/template-questions-card";
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
 * @param loadInterviews
 * @param updateInterview
 * @param loadTemplates
 * @param loadLibrary
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewDetails = ({
    interviews,
    templates,
    library,
    addInterview,
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

    const [interview, setInterview] = useState(emptyInterview);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [questionGroupModal, setQuestionGroupModal] = useState({
        visible: false,
        name: null,
        id: null
    });

    React.useEffect(() => {
        if (isExistingInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            setInterview(cloneDeep(findInterview(id, interviews)))
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        if (isFromTemplateFlow() && !interview.templateId && templates.length !== 0) {
            const template = cloneDeep(findTemplate(fromTemplateId(), templates))
            setInterview({
                interviewId: undefined,
                templateId: template.templateId,
                status: Status.NEW,
                title: "",
                structure: template.structure
            })
        }
        // eslint-disable-next-line
    }, [templates]);

    React.useEffect(() => {
        if (isFromLibraryFlow() && !interview.libraryId && library.length !== 0) {
            const template = cloneDeep(findLibraryTemplate(fromLibraryId(), library))
            setInterview({
                interviewId: undefined,
                libraryId: template.libraryId,
                status: Status.NEW,
                title: "",
                structure: template.structure
            })
        }
        // eslint-disable-next-line
    }, [library]);

    React.useEffect(() => {
        if(isFromTemplateFlow()) {
            loadTemplates()
        } else if (isExistingInterviewFlow()) {
            loadInterviews()
        } else if (isFromLibraryFlow()) {
            loadLibrary()
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
        const updatedInterview = cloneDeep(interview)
        updatedInterview.structure.groups
            .find(group => group.groupId === groupId).questions = questions
        setInterview(updatedInterview)
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
        } else {
            personalEvent('Interview created');
            addInterview(interview);
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
                            <ArrowLeftOutlined /> <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>Interview Edit</Title>
                        </div>
                    </div>
                    <Text type="secondary">Enter interview details information so you can easily discover it among other interviews.</Text>
                    <div className={styles.divSpaceBetween}>
                        <Space direction="vertical" className={styles.divFlexGrow} style={{ marginRight: 16 }}>
                            <Text strong>Candidate</Text>
                            <Input
                                placeholder="e.g. Kristin Watson"
                                onChange={onCandidateChange}
                                defaultValue={interview.candidate}
                            />
                        </Space>
                        <Space direction="vertical" className={styles.divFlexGrow} style={{ marginRight: 16 }}>
                            <Text strong>Interview Date</Text>
                            <DatePicker showTime
                                        allowClear={false}
                                        format={DATE_FORMAT_DISPLAY}
                                        className={styles.date}
                                        defaultValue={interview.interviewDateTime ? moment(interview.interviewDateTime) : ''}
                                        onChange={onDateChange}
                            />
                        </Space>
                        <Space direction="vertical" className={styles.divFlexGrow}>
                            <Text strong>Position</Text>
                            <Input
                                placeholder="e.g. Junior Software Developer"
                                defaultValue={interview.position}
                                onChange={onPositionChange}
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
                                 src={process.env.PUBLIC_URL + '/app/interview-groups.png'} />
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
                    <Title level={4}>Summary</Title>
                    <Text type="secondary">The summary section serves as a reminder for what interviewer must do at the
                        end of the interview. It also contains fields to take notes and make a final assessment.</Text>
                    <TextArea
                        style={marginTop16}
                        defaultValue={interview.structure.footer}
                        onChange={onFooterChanged}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder="Allow 10 minutes at the end for the candidate to ask questions." />
                    <Divider />

                    <div className={styles.divSpaceBetween}>
                        <Text />
                        <Space>
                            <Button onClick={onPreviewClicked}>Interview experience</Button>
                            <Button type="primary" onClick={onSaveClicked}>Save interview</Button>
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
            <InterviewPreviewCard interview={interview} onCloseClicked={onPreviewClosed} />
        </Modal>
    </Layout>
}

const mapDispatch = { addInterview, loadInterviews, updateInterview, loadTemplates, loadLibrary };
const mapState = (state) => {
    const interviewState = state.interviews || {};
    const templateState = state.templates || {};

    return {
        interviews: interviewState.interviews,
        templates: templateState.templates,
        library: templateState.library,
    }
}

export default connect(mapState, mapDispatch)(InterviewDetails)