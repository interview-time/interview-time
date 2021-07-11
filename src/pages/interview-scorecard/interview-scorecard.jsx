import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, Col, message, Row, Space } from "antd";
import Layout from "../../components/layout/layout";
import styles from "./interview-scorecard.module.css";
import { connect } from "react-redux";
import { deleteInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { cloneDeep } from "lodash/lang";
import { debounce } from "lodash/function";
import {
    routeInterviewCandidate,
    routeInterviewDetails,
    routeInterviews,
} from "../../components/utils/route";
import {
    findGroup,
    findInterview,
    findQuestionInGroups,
    findTemplate,
} from "../../components/utils/converters";
import Text from "antd/lib/typography/Text";
import { loadTemplates } from "../../store/templates/actions";
import {
    InterviewGroupsSection,
    IntroSection,
    SummarySection,
    InterviewInformationSection,
} from "./interview-sections";
import NotesSection from "./notes-section";

const DATA_CHANGE_DEBOUNCE_MAX = 60 * 1000; // 60 sec
const DATA_CHANGE_DEBOUNCE = 30 * 1000; // 30 sec

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
const InterviewScorecard = ({
    interviews,
    templates,
    interviewsUploading,
    deleteInterview,
    loadInterviews,
    updateInterview,
    loadTemplates,
}) => {
    /**
     * @type {InterviewScorecard}
     */
    const emptyInterview = {
        candidate: "",
        position: "",
        interviewDateTime: "",
        structure: {
            groups: [],
        },
    };

    /**
     * @type {Template}
     */
    const emptyTemplate = {};

    const [interview, setInterview] = useState(emptyInterview);
    const [template, setTemplate] = useState(emptyTemplate);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [interviewChangedCounter, setInterviewChangedCounter] = useState(0);

    const { id } = useParams();

    const history = useHistory();

    React.useEffect(() => {
        // initial data loading
        if (!interview.interviewId && interviews.length > 0) {
            setInterview(cloneDeep(findInterview(id, interviews)));
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        // initial data loading
        if (!template.templateId && templates.length > 0 && interview.templateId) {
            const interviewTemplate = findTemplate(interview.templateId, templates);
            if (interviewTemplate) {
                setTemplate(cloneDeep(interviewTemplate));
            }
        }
        // eslint-disable-next-line
    }, [interview, templates]);

    React.useEffect(() => {
        loadInterviews();
        loadTemplates();

        return () => {
            onInterviewChangeDebounce.cancel();
        };
        // eslint-disable-next-line
    }, []);

    // eslint-disable-next-line
    const onInterviewChangeDebounce = React.useCallback(
        debounce(
            function (interview) {
                updateInterview(interview);
                setUnsavedChanges(false);
            },
            DATA_CHANGE_DEBOUNCE,
            { maxWait: DATA_CHANGE_DEBOUNCE_MAX }
        ),
        []
    );

    React.useEffect(() => {
        if (interviewChangedCounter > 0) {
            onInterviewChangeDebounce(interview);
        }
        // eslint-disable-next-line
    }, [interviewChangedCounter]);
    const initialLoading = () => !interview.interviewId;

    const onInterviewChange = () => {
        setUnsavedChanges(true);
        setInterviewChangedCounter(interviewChangedCounter + 1);
    };

    const onDeleteInterview = () => {
        deleteInterview(interview.interviewId);
        history.push(routeInterviews());
    };

    const onEditInterview = () => {
        history.push(routeInterviewDetails(interview.interviewId));
    };

    const onBackClicked = () => {
        // don't use back because of anchor links
        history.push(routeInterviews());
    };

    const onSaveClicked = () => {
        updateInterview(interview);
        setUnsavedChanges(false);
        message.success(`Interview '${interview.candidate}' updated.`);
    };

    const onNoteChanges = (e) => {
        interview.notes = e.target.value;
        onInterviewChange();
    };

    const onGroupAssessmentChanged = (group, assessment) => {
        findGroup(group.groupId, interview.structure.groups).assessment = assessment;
        onInterviewChange();
    };

    const onQuestionAssessmentChanged = (question, assessment) => {
        findQuestionInGroups(question.questionId, interview.structure.groups).assessment = assessment;
        onInterviewChange();
    };

    const onCandidateEvaluationClicked = () => {
        if (unsavedChanges) {
            onSaveClicked();
        }
        history.push(routeInterviewCandidate(interview.interviewId));
    };

    return (
        <Layout>
            <Row className={styles.rootContainer}>
                <Col
                    key={interview.interviewId}
                    xxl={{ span: 16, offset: 4 }}
                    xl={{ span: 20 }}
                    lg={{ span: 24 }}
                    md={{ span: 24 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
                >
                    <div style={{ marginBottom: 12 }}>
                        <InterviewInformationSection
                            title="Interview"
                            onBackClicked={onBackClicked}
                            onDeleteInterview={onDeleteInterview}
                            onEditInterview={onEditInterview}
                            loading={initialLoading()}
                            interview={interview}
                        />
                    </div>

                    <Card style={{ marginBottom: 12 }}>
                        <IntroSection interview={interview} hashStyle={styles.hash} />
                    </Card>

                    <InterviewGroupsSection
                        interview={interview}
                        onGroupAssessmentChanged={onGroupAssessmentChanged}
                        onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                        hashStyle={styles.hash}
                    />

                    <Card style={{ marginTop: 12 }}>
                        <SummarySection interview={interview} onNoteChanges={onNoteChanges} />
                    </Card>

                    <NotesSection
                        notes={interview.notes}
                        status={interview.status}
                        onChange={onNoteChanges}
                    />

                    <Card style={{ marginTop: 12, marginBottom: 12 }}>
                        <div className={styles.divSpaceBetween}>
                            <Text strong>Ready to make hiring recommendation?</Text>
                            <Space>
                                <Button loading={interviewsUploading} onClick={onSaveClicked}>
                                    Save
                                </Button>
                                <Button type="primary" onClick={onCandidateEvaluationClicked}>
                                    Open Candidate Evaluation
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Col>
                <Col
                    key={interview.interviewId}
                    xxl={{ span: 4 }}
                    xl={{ span: 4 }}
                    lg={{ span: 0 }}
                    md={{ span: 0 }}
                    sm={{ span: 0 }}
                    xs={{ span: 0 }}
                >
                    <div className={styles.toc}>
                        <a href={"#intro"} className={styles.anchorLink}>
                            Intro
                        </a>
                        {interview.structure.groups.map((group) => (
                            <a href={`#${group.name}`} className={styles.anchorLink}>
                                {group.name}
                            </a>
                        ))}
                        <a href={"#summary"} className={styles.anchorLink}>
                            Summary
                        </a>
                    </div>
                </Col>
            </Row>
        </Layout>
    );
};

const mapDispatch = { deleteInterview, loadInterviews, updateInterview, loadTemplates };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const templatesState = state.templates || {};
    return {
        interviews: interviewsState.interviews,
        interviewsUploading: interviewsState.uploading,
        templates: templatesState.templates,
    };
};

export default connect(mapState, mapDispatch)(InterviewScorecard);
