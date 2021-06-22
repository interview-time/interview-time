import { deleteInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import styles from "./interviews-evaluation.module.css";
import { Button, Card, Col, Modal, Progress, Row, Space} from "antd";
import React, { useState } from "react";
import Text from "antd/lib/typography/Text";
import {
    getAssessmentColor,
    getAssessmentText,
    getDecisionText,
    getOverallPerformance,
    getOverallPerformanceColor,
    getQuestionsPerformance,
    getQuestionsWithAssessment,
    InterviewAssessment,
    Status
} from "../../components/utils/constants";
import { useHistory, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview, findTemplate } from "../../components/utils/converters";
import { useAuth0 } from "../../react-auth0-spa";
import Radio from "antd/es/radio/radio";
import { loadTemplates } from "../../store/templates/actions";
import { InterviewInformationSection } from "../interview-scorecard/interview-sections";
import InterviewDecisionAlert from "./interview-decision-alert";
import { personalEvent } from "../../analytics";
import { routeCandidates, routeInterviewDetails } from "../../components/utils/route";
import StickyHeader from "../../components/layout/header-sticky";

function bodyStyleCard() {
    return {
        height: 220,
        overflow: 'scroll'
    };
}

/**
 *
 * @param {Interview[]} interviews
 * @param {Template[]} templates
 * @param loadInterviews
 * @param updateInterview
 * @param deleteInterview
 * @param loadTemplates
 */
const InterviewEvaluation = ({
                                 interviews,
                                 templates,
                                 loadInterviews,
                                 updateInterview,
                                 deleteInterview,
                                 loadTemplates }) => {

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
    const emptyTemplate = {
    }

    const [interview, setInterview] = useState(emptyInterview);
    const [template, setTemplate] = useState(emptyTemplate);

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
        if (!template.templateId && templates.length > 0 && interview.templateId) {
            const interviewTemplate = findTemplate(interview.templateId, templates);
            if(interviewTemplate) {
                setTemplate(cloneDeep(interviewTemplate))
            }
        }
        // eslint-disable-next-line
    }, [interview, templates]);

    React.useEffect(() => {
        loadInterviews();
        loadTemplates();
        // eslint-disable-next-line
    }, []);

    const isCompletedStatus = () => interview.status === Status.COMPLETED

    const onAssessmentChanged = e => {
        setInterview({
            ...interview,
            decision: e.target.value
        })
    };

    const onSubmitClicked = () => {
        if (interview.decision) {
            Modal.confirm({
                title: "Submit Candidate Evaluation",
                content: "You will not be able to make changes to this interview anymore. Are you sure that you want to continue?",
                okText: "Yes",
                cancelText: "No",
                onOk() {
                    updateInterview({
                        ...interview,
                        status: Status.COMPLETED
                    });
                    history.push(routeCandidates())
                    personalEvent('Interview completed');
                }
            })
        } else {
            Modal.warn({
                title: "Submit Candidate Evaluation",
                content: "Please select 'hiring recommendation'.",
            })
        }
    }

    const onDeleteInterview = () => {
        deleteInterview(interview.interviewId);
        history.push(routeCandidates());
    }

    const onEditInterview = () => {
        history.push(routeInterviewDetails(interview.interviewId));
    }

    const onBackClicked = () => {
        history.goBack()
    }

    const initialLoading = () => !interview.interviewId

    const CompetenceAreaCard = () => <Card title="Competence Areas"
                                           bodyStyle={bodyStyleCard()}
                                           loading={initialLoading()}>
        {interview.structure.groups.map(group =>
            <Row style={{ marginBottom: 24 }} justify="center">
                <Col flex="1" className={styles.divHorizontalCenter}>
                    <span>{group.name}</span>
                </Col>
                <Col flex="1" className={styles.divHorizontalCenter}>
                    <Progress
                        type='line'
                        strokeLinecap='square'
                        strokeColor='#69C0FF'
                        steps={10}
                        strokeWidth={16}
                        percent={getQuestionsPerformance(group)}
                    />
                </Col>
                <Col flex="1" className={styles.divHorizontalCenter}>
                                            <span className={styles.dotSmall}
                                                  style={{ backgroundColor: getAssessmentColor(group.assessment) }} />
                    <span>{getAssessmentText(group.assessment)}</span>
                </Col>
            </Row>
        )}
    </Card>;

    const OverallPerformanceCard = () => <Card title="Overall Performance"
                                               bodyStyle={bodyStyleCard()}
                                               loading={initialLoading()}>
        <div className={styles.divVerticalCenter}>
            <Progress
                style={{ marginBottom: 16 }}
                type='circle'
                strokeLinecap='square'
                strokeColor={getOverallPerformanceColor(interview.structure.groups)}
                percent={getOverallPerformance(interview.structure.groups)}
            />
            <span>{getQuestionsWithAssessment(interview.structure.groups).length} questions</span>
        </div>

    </Card>;

    const NotesCard = () => <Card title="Notes"
                                  style={{ marginBottom: 12 }}
                                  loading={initialLoading()}>
        <span>{interview.notes && interview.notes.length > 0 ? interview.notes : "There are no notes."}</span>
    </Card>;

    const DecisionCard = () => <Card style={{ marginBottom: 12 }} loading={initialLoading()}>
        <Row>
            <Space className={styles.space} direction="vertical">
                <Text strong>Ready to make hiring recommendation?</Text>
                <Text>Based on the interview data, please evaluate if the candidate is qualified for the
                    position.</Text>

                <div className={styles.divSpaceBetween}>
                    <Radio.Group
                        value={interview.decision}
                        disabled={isCompletedStatus()}
                        buttonStyle="solid"
                        onChange={onAssessmentChanged}
                    >
                        <Radio.Button value={InterviewAssessment.STRONG_NO}>
                            {getDecisionText(InterviewAssessment.STRONG_NO)}
                        </Radio.Button>
                        <Radio.Button value={InterviewAssessment.NO}>
                            {getDecisionText(InterviewAssessment.NO)}
                        </Radio.Button>
                        <Radio.Button value={InterviewAssessment.YES}>
                            {getDecisionText(InterviewAssessment.YES)}
                        </Radio.Button>
                        <Radio.Button value={InterviewAssessment.STRONG_YES}>
                            {getDecisionText(InterviewAssessment.STRONG_YES)}
                        </Radio.Button>
                    </Radio.Group>

                    <Button type="primary"
                            onClick={onSubmitClicked}
                            disabled={isCompletedStatus()}>
                        Submit candidate evaluation
                    </Button>
                </div>
            </Space>
        </Row>
    </Card>;

    return (
        <Layout>
            <Row className={styles.rootContainer}>

                <Col key={interview.interviewId}
                     xxl={{ span: 16, offset: 4 }}
                     xl={{ span: 20, offset: 2 }}
                     lg={{ span: 24 }}>

                    {interview.decision !== 0 && <InterviewDecisionAlert interview={interview} />}

                    <div style={{ marginBottom: 12 }}>
                        <InterviewInformationSection
                            title="Candidate Evaluation"
                            onBackClicked={onBackClicked}
                            onDeleteInterview={onDeleteInterview}
                            onEditInterview={onEditInterview}
                            loading={initialLoading()}
                            userName={user.name}
                            interview={interview}
                            template={template} />
                    </div>

                    <Row gutter={12} style={{ marginBottom: 12 }}>
                        <Col span={6}>{OverallPerformanceCard()}</Col>
                        <Col span={18}>{CompetenceAreaCard()}</Col>
                    </Row>

                    {NotesCard()}

                    {DecisionCard()}

                </Col>
            </Row>
        </Layout>
    )
}

const mapDispatch = { loadInterviews, updateInterview, deleteInterview, loadTemplates }

const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const templatesState = state.templates || {};
    return {
        interviews: interviewsState.interviews,
        templates: templatesState.templates
    }
}

export default connect(mapState, mapDispatch)(InterviewEvaluation);