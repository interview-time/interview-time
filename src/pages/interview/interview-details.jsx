import styles from "./interview.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Card, Col, DatePicker, Divider, Input, message, Modal, Row, Select, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview} from "../../components/utils/converters";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_SERVER} from "../../components/utils/constants";
import Layout from "../../components/layout/layout";
import arrayMove from "array-move";
import { TemplatePreviewCard } from "../interview-scorecard/interview-sections";
import { addInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import TemplateGroupModal from "../template/template-group-modal";
import TemplateQuestionsCard from "../template/template-questions-card";
import moment from "moment";
import { personalEvent } from "../../analytics";
import { routeInterviews } from "../../components/utils/route";

const { TextArea } = Input;

/**
 *
 * @param {Interview[]} interviews
 * @param addInterview
 * @param loadInterviews
 * @param updateInterview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewDetails = ({
    interviews,
    addInterview,
    loadInterviews,
    updateInterview
}) => {

    /**
     *
     * @type {Interview}
     */
    const emptyInterview = {
        interviewId: undefined,
        title: "",
        structure: {
            header: "Take 10 minutes to introduce yourself and make the candidate comfortable.",
            footer: "Allow 10 minutes at the end for the candidate to ask questions.",
            groups: [],
        }
    }

    const history = useHistory();

    const { id } = useParams();

    const [interview, setInterview] = useState(emptyInterview);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [questionGroupModal, setQuestionGroupModal] = useState({
        visible: false,
        name: null,
        id: null
    });

    React.useEffect(() => {
        if (!isNewInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            setInterview(cloneDeep(findInterview(id, interviews)))
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        if (!isNewInterviewFlow()) {
            loadInterviews()
        }
        // eslint-disable-next-line
    }, []);

    const isNewInterviewFlow = () => !id;

    const isInitialLoading = () => !isNewInterviewFlow() && !interview.interviewId

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
        if (isNewInterviewFlow()) {
            personalEvent('Interview created');
            addInterview(interview);
            message.success(`Interview '${interview.candidate}' created.`);
        } else {
            updateInterview(interview);
            message.success(`Interview '${interview.candidate}' updated.`);
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

    const marginTop24 = { marginTop: 24 };
    const marginVertical24 = { marginTop: 24, marginBottom: 24 };
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
                <Card style={marginTop24} key={interview.interviewId} loading={isInitialLoading()}>
                    <Title level={4}>Interview</Title>
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

                <Card style={marginTop24} loading={isInitialLoading()}>
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

                <Card style={marginTop24} loading={isInitialLoading()}>
                    <Title level={4}>Questions</Title>
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
                    <Button style={marginTop24} onClick={onAddQuestionGroupClicked}>Add Question Group</Button>
                </Card>

                <Card style={marginVertical24} loading={isInitialLoading()}>
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
                        <Button onClick={onBackClicked}>Back</Button>
                        <Space>
                            <Button onClick={onPreviewClicked}>Interview Preview</Button>
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

        <Modal
            title="Interview"
            width={1000}
            style={{ top: '5%' }}
            destroyOnClose={true}
            footer={null}
            onCancel={onPreviewClosed}
            visible={previewModalVisible}>
            <TemplatePreviewCard template={interview} />
        </Modal>
    </Layout>
}

const mapDispatch = { addInterview, loadInterviews, updateInterview };
const mapState = (state) => {
    const interviewState = state.interviews || {};

    return {
        interviews: interviewState.interviews
    }
}

export default connect(mapState, mapDispatch)(InterviewDetails)