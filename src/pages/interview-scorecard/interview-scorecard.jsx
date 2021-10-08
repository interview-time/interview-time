import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, Col, Modal, Progress, Row, Space, Steps } from "antd";
import Layout from "../../components/layout/layout";
import styles from "./interview-scorecard.module.css";
import { connect } from "react-redux";
import { deleteInterview, loadInterviews, updateScorecard, updateInterview } from "../../store/interviews/actions";
import { cloneDeep } from "lodash/lang";
import { debounce } from "lodash/function";
import { routeInterviewDetails, routeInterviews, routeReports, } from "../../components/utils/route";
import { findInterview, findQuestionInGroups } from "../../components/utils/converters";
import {
    InterviewAssessmentButtons,
    InterviewGroupsSection,
    InterviewInformationSection,
    IntroSection,
    SummarySection,
} from "./interview-sections";
import NotesSection from "./notes-section";
import TimeAgo from "../../components/time-ago/time-ago";
import Spinner from "../../components/spinner/spinner";
import {
    getGroupAssessmentColor,
    getGroupAssessmentPercent,
    getGroupAssessmentText,
    getOverallPerformanceColor,
    getOverallPerformancePercent,
    getQuestionsWithAssessment
} from "../../components/utils/assessment";
import Text from "antd/lib/typography/Text";
import { Status } from "../../components/utils/constants";
import { personalEvent } from "../../analytics";

const { Step } = Steps;

const DATA_CHANGE_DEBOUNCE_MAX = 10 * 1000; // 10 sec
const DATA_CHANGE_DEBOUNCE = 2 * 1000; // 2 sec
const STEP_INTERVIEW = 0
const STEP_FEEDBACK = 1

/**
 *
 * @param {Interview[]} interviews
 * @param {Template[]} templates
 * @param {boolean} interviewsUploading
 * @param deleteInterview
 * @param loadInterviews
 * @param updateScorecard
 * @param updateInterview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewScorecard = ({
    interviews,
    interviewsUploading,
    deleteInterview,
    loadInterviews,
    updateScorecard,
    updateInterview
}) => {
    /**
     * @type {Template}
     */

    const [interview, setInterview] = useState();
    const [step, setStep] = React.useState(STEP_INTERVIEW);

    const { id } = useParams();

    const history = useHistory();

    useEffect(() => {
        // initial data loading
        if (interviews.length > 0 && !interview) {
            setInterview(cloneDeep(findInterview(id, interviews)));
        }
        // eslint-disable-next-line
    }, [interviews]);

    useEffect(() => {
        loadInterviews();

        return () => {
            onInterviewChangeDebounce.cancel();
        };
        // eslint-disable-next-line
    }, []);

    // eslint-disable-next-line
    const onInterviewChangeDebounce = React.useCallback(
        debounce(
            function (interview) {
                updateScorecard(interview);
            },
            DATA_CHANGE_DEBOUNCE,
            { maxWait: DATA_CHANGE_DEBOUNCE_MAX }
        ),
        []
    );

    React.useEffect(() => {
        if (interview) {
            onInterviewChangeDebounce(interview);
        }
        // eslint-disable-next-line
    }, [interview]);

    const onStepChanged = (current) => {
        if (current === STEP_INTERVIEW) {
            setStep(STEP_INTERVIEW);
        } else if (current === STEP_FEEDBACK) {
            updateScorecard(interview);
            setStep(STEP_FEEDBACK);
        }
    }

    const isCompletedStatus = () => interview.status === Status.COMPLETED;

    const onDeleteInterview = () => {
        deleteInterview(interview.interviewId);
        history.push(routeInterviews());
    };

    const onEditInterview = () => {
        history.push(routeInterviewDetails(interview.interviewId));
    };

    const onQuestionNotesChanged = (questionId, notes) => {
        setInterview((prevInterview) => {
            findQuestionInGroups(questionId, prevInterview.structure.groups).notes = notes;

            return { ...prevInterview };
        });
    };

    const onQuestionAssessmentChanged = (questionId, assessment) => {
        setInterview((prevInterview) => {
            findQuestionInGroups(questionId, prevInterview.structure.groups).assessment = assessment;

            return { ...prevInterview };
        });
    };

    const onNoteChanges = (e) => {
        setInterview({ ...interview, notes: e.target.value });
    };

    const onAssessmentChanged = (assessment) => {
        setInterview({
            ...interview,
            decision: assessment,
        });
    };

    const showFeedbackStep = () => {
        onStepChanged(STEP_FEEDBACK)
    };

    const onSubmitClicked = () => {
        if (interview.decision) {
            Modal.confirm({
                title: "Submit Candidate Evaluation",
                content:
                    "You will not be able to make changes to this interview-schedule anymore. Are you sure that you want to continue?",
                okText: "Yes",
                cancelText: "No",
                onOk() {
                    updateInterview({
                        ...interview,
                        status: Status.COMPLETED,
                    });
                    history.push(routeReports());
                    personalEvent("Interview completed");
                },
            });
        } else {
            Modal.warn({
                title: "Submit Candidate Evaluation",
                content: "Please select 'hiring recommendation'.",
            });
        }
    };

    const bodyStyleCard = () => ({
        height: 220,
        overflow: "scroll",
    });

    const CompetenceAreaCard = () => (
        <Card title="Competence Areas" bodyStyle={bodyStyleCard()}>
            {interview.structure.groups.map((group) => (
                <Row style={{ marginBottom: 24 }} justify="center">
                    <Col flex="1" className={styles.divHorizontalCenter}>
                        <span>{group.name}</span>
                    </Col>
                    <Col flex="1" className={styles.divHorizontalCenter}>
                        <Progress
                            type="line"
                            status="active"
                            strokeLinecap="square"
                            strokeColor={getGroupAssessmentColor(group)}
                            steps={10}
                            strokeWidth={16}
                            percent={getGroupAssessmentPercent(group)}
                        />
                    </Col>
                    <Col flex="1" className={styles.divHorizontalCenter}>
                        <span
                            className={styles.dotSmall}
                            style={{ backgroundColor: getGroupAssessmentColor(group) }}
                        />
                        <span>{getGroupAssessmentText(group)}</span>
                    </Col>
                </Row>
            ))}
        </Card>
    );

    const OverallPerformanceCard = () => (
        <Card title="Overall Performance" bodyStyle={bodyStyleCard()}>
            <div className={styles.divVerticalCenter}>
                <Progress
                    style={{ marginBottom: 16 }}
                    type="circle"
                    status="active"
                    strokeLinecap="square"
                    strokeColor={getOverallPerformanceColor(interview.structure.groups)}
                    percent={getOverallPerformancePercent(interview.structure.groups)}
                />
                <span>{getQuestionsWithAssessment(interview.structure.groups).length} questions</span>
            </div>
        </Card>
    );

    const NotesCard = () => (
        <Card title="Notes" style={{ marginBottom: 12 }}>
            <span className="fs-mask">
                {interview.notes && interview.notes.length > 0 ? interview.notes : "There are no notes."}
            </span>
        </Card>
    );

    const DecisionCard = () => (
        <Card style={{ marginBottom: 24 }}>
            <Row>
                <Space className={styles.space} direction="vertical">
                    <Text strong>Ready to make hiring recommendation?</Text>
                    <Text>
                        Based on the interview data, please evaluate if the candidate is qualified for the
                        position.
                    </Text>

                    <div className={styles.divSpaceBetween}>
                        <InterviewAssessmentButtons
                            assessment={interview.decision}
                            disabled={isCompletedStatus()}
                            onAssessmentChanged={(assessment) => {
                                onAssessmentChanged(assessment);
                            }}
                        />
                        <Button type="primary" onClick={onSubmitClicked} disabled={isCompletedStatus()}>
                            Submit Evaluation
                        </Button>
                    </div>
                </Space>
            </Row>
        </Card>
    );

    return interview ? (
        <Layout>
            <Row className={styles.rootContainer}>
                <Col span={24} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
                    <Card style={{ marginBottom: 12 }}>
                        <Steps current={step} onChange={onStepChanged}>
                            <Step
                                title="Interview"
                                className={styles.stepInterview}
                                description={
                                    <Text className={styles.stepDescription}>Run interview and capture feedback.</Text>
                                } />
                            <Step
                                title="Feedback"
                                className={styles.stepFeedback}
                                description={
                                    <Text className={styles.stepDescription}>Review and submit interview decision.</Text>
                                } />
                        </Steps>
                    </Card>

                    {step === STEP_INTERVIEW && <div>
                        <div style={{ marginBottom: 12 }}>
                            <InterviewInformationSection
                                title="Interview"
                                onDeleteInterview={onDeleteInterview}
                                onEditInterview={onEditInterview}
                                interview={interview}
                            />
                        </div>

                        <Card style={{ marginBottom: 12 }}>
                            <IntroSection interview={interview} hashStyle={styles.hash} />
                        </Card>

                        <InterviewGroupsSection
                            interview={interview}
                            onQuestionNotesChanged={onQuestionNotesChanged}
                            onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                            hashStyle={styles.hash}
                        />

                        <Card style={{ marginTop: 12 }}>
                            <SummarySection interview={interview} />
                        </Card>

                        <NotesSection
                            notes={interview.notes}
                            status={interview.status}
                            onChange={onNoteChanges}
                        />

                        <Card style={{ marginTop: 12, marginBottom: 24 }}>
                            <div className={styles.divSpaceBetween}>
                                <TimeAgo timestamp={interview.modifiedDate} saving={interviewsUploading} />
                                <Button type="primary" onClick={showFeedbackStep}>
                                    Next to Feedback
                                </Button>
                            </div>
                        </Card>
                    </div>}

                    {step === STEP_FEEDBACK && <div>
                        <div style={{ marginBottom: 12 }}>
                            <InterviewInformationSection
                                title="Candidate Evaluation"
                                interview={interview}
                            />
                        </div>

                        <Row gutter={12} style={{ marginBottom: 12 }}>
                            <Col span={6}>{OverallPerformanceCard()}</Col>
                            <Col span={18}>{CompetenceAreaCard()}</Col>
                        </Row>

                        {NotesCard()}

                        {DecisionCard()}
                    </div>}

                </Col>
            </Row>
        </Layout>
    ) : (
        <Spinner />
    );
};

const mapDispatch = { deleteInterview, loadInterviews, updateScorecard, updateInterview };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    return {
        interviews: interviewsState.interviews,
        interviewsUploading: interviewsState.uploading,
    };
};

export default connect(mapState, mapDispatch)(InterviewScorecard);
