import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, Col, Divider, message, Row, Tag } from 'antd';
import Layout from "../../components/layout/layout";
import styles from "./interview.module.css";
import { connect } from "react-redux";
import { deleteInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import { cloneDeep } from "lodash/lang";
import { debounce } from "lodash/function";
import { routeInterviewCandidate, routeInterviews } from "../../components/utils/route";
import { findGroup, findInterview, findQuestionInGroups, findTemplate } from "../../components/utils/converters";
import Text from "antd/lib/typography/Text";
import { useAuth0 } from "../../react-auth0-spa";
import InterviewDecisionAlert from "../interview-evaluation/interview-decision-alert";
import { loadTemplates } from "../../store/templates/actions";
import { GroupsSection, IntroSection, SummarySection, InterviewInformationSection } from "./interview-sections";

const DATA_CHANGE_DEBOUNCE_MAX = 60 * 1000 // 60 sec
const DATA_CHANGE_DEBOUNCE = 30 * 1000 // 30 sec

/**
 *
 * @param {Interview[]} interviews
 * @param {Template[]} templates
 * @param {boolean} interviewsUploading
 * @param deleteInterview
 * @param loadInterviews
 * @param updateInterview
 * @param loadTemplates
 * @returns {JSX.Element}
 * @constructor
 */
const Interview = ({
                       interviews,
                       templates,
                       interviewsUploading,
                       deleteInterview,
                       loadInterviews,
                       updateInterview,
                       loadTemplates
                   }) => {

    /**
     * @type {Interview}
     */
    const emptyInterview = {
        candidate: '',
        position: '',
        interviewDateTime: '',
        structure: {
            groups: []
        }
    }

    /**
     * @type {Template}
     */
    const emptyTemplate = {}

    const [interview, setInterview] = useState(emptyInterview);
    const [template, setTemplate] = useState(emptyTemplate);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [interviewChangedCounter, setInterviewChangedCounter] = useState(0);

    const { id } = useParams();
    const { user } = useAuth0();

    const history = useHistory();

    React.useEffect(() => {
        // initial data loading
        if (!interview.interviewId && interviews.length > 0) {
            setInterview(cloneDeep(findInterview(id, interviews)))
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        // initial data loading
        if (!template.guideId && templates.length > 0 && interview.guideId) {
            const interviewTemplate = findTemplate(interview.guideId, templates);
            if (interviewTemplate) {
                setTemplate(cloneDeep(interviewTemplate))
            }
        }
        // eslint-disable-next-line
    }, [interview, templates]);

    React.useEffect(() => {
        loadInterviews();
        loadTemplates();

        return () => {
            onInterviewChangeDebounce.cancel();
        }
        // eslint-disable-next-line
    }, []);

    // eslint-disable-next-line
    const onInterviewChangeDebounce = React.useCallback(debounce(function (interview) {
        updateInterview(interview)
        setUnsavedChanges(false)
    }, DATA_CHANGE_DEBOUNCE, { 'maxWait': DATA_CHANGE_DEBOUNCE_MAX }), [])

    React.useEffect(() => {
        if (interviewChangedCounter > 0) {
            onInterviewChangeDebounce(interview)
        }
        // eslint-disable-next-line
    }, [interviewChangedCounter])
    const initialLoading = () => !interview.interviewId

    const onInterviewChange = () => {
        setUnsavedChanges(true)
        setInterviewChangedCounter(interviewChangedCounter + 1)
    }

    const onDeleteInterview = () => {
        deleteInterview(interview.interviewId);
        history.push(routeInterviews());
    }

    const onBackClicked = () => {
        history.goBack()
    }

    const onSaveClicked = () => {
        updateInterview(interview)
        setUnsavedChanges(false)
        message.success(`Interview '${interview.candidate}' updated.`);
    }

    const onNoteChanges = e => {
        interview.notes = e.target.value
        onInterviewChange()
    };

    const onGroupAssessmentChanged = (group, assessment) => {
        findGroup(group.groupId, interview.structure.groups).assessment = assessment
        onInterviewChange()
    };

    const onQuestionAssessmentChanged = (question, assessment) => {
        findQuestionInGroups(question.questionId, interview.structure.groups).assessment = assessment
        console.log(question)
        console.log(interview.structure.groups)
        onInterviewChange()
    }

    const onGroupNotesChanged = (group, notes) => {
        findGroup(group.groupId, interview.structure.groups).notes = notes
        onInterviewChange()
    };

    const onCandidateEvaluationClicked = () => {
        if(unsavedChanges) {
            onSaveClicked()
        }
        history.push(routeInterviewCandidate(interview.interviewId))
    };

    return (
        <Layout pageHeader={
            <div className={styles.header}>
                <div className={styles.headerTitleContainer}>
                    <div onClick={onBackClicked}>
                        <ArrowLeftOutlined />
                        <span className={styles.headerTitle}>Interview Scorecard</span>
                    </div>
                    <>
                        {interviewsUploading && <Tag
                            style={{ marginLeft: 16 }}
                            icon={<SyncOutlined spin />}
                            color="processing">saving data</Tag>}
                        {unsavedChanges && <Tag
                            style={{ marginLeft: 16 }}
                            color="processing">unsaved changes</Tag>}
                    </>
                </div>
                <Button
                    type="primary"
                    loading={interviewsUploading}
                    onClick={onSaveClicked}>Save</Button>
            </div>
        }>
            <Row className={styles.rootContainer}>
                <Col key={interview.interviewId}
                     xxl={{ span: 16, offset: 4 }}
                     xl={{ span: 20, offset: 2 }}
                     lg={{ span: 24 }}>

                    {interview.decision && <InterviewDecisionAlert interview={interview} />}

                    <div style={{ marginBottom: 12 }}>
                        <InterviewInformationSection
                            onDeleteInterview={onDeleteInterview}
                            loading={initialLoading()}
                            showMoreSection={true}
                            userName={user.name}
                            interview={interview}
                            template={template} />
                    </div>

                    <Card>

                        <IntroSection interview={interview} />
                        <GroupsSection
                            interview={interview}
                            onGroupAssessmentChanged={onGroupAssessmentChanged}
                            onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                            onNotesChanged={onGroupNotesChanged}
                        />
                        <SummarySection interview={interview} onNoteChanges={onNoteChanges} />

                        <Divider />

                        <div className={styles.divSpaceBetween}>
                            <Text bold>Ready to make hiring recommendation?</Text>
                            <Button type="primary" onClick={onCandidateEvaluationClicked}>Open Candidate Evaluation</Button>
                        </div>

                    </Card>
                </Col>
            </Row>
        </Layout>
    )
}

const mapDispatch = { deleteInterview, loadInterviews, updateInterview, loadTemplates }
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const templatesState = state.guides || {};
    return {
        interviews: interviewsState.interviews,
        interviewsUploading: interviewsState.uploading,
        templates: templatesState.guides
    }
}

export default connect(mapState, mapDispatch)(Interview);