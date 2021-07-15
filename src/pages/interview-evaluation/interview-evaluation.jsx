import { deleteInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import styles from "./interviews-evaluation.module.css";
import { Button, Card, Col, Modal, Progress, Row, Space} from "antd";
import React, { useState } from "react";
import Text from "antd/lib/typography/Text";
import {
    Status
} from "../../components/utils/constants";
import {
    getGroupAssessmentColor,
    getGroupAssessmentPercent,
    getGroupAssessmentText,
    getOverallPerformanceColor,
    getOverallPerformancePercent,
    getQuestionsWithAssessment,
} from "../../components/utils/assessment";
import { useHistory, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview } from "../../components/utils/converters";
import { InterviewAssessmentButtons, InterviewInformationSection } from "../interview-scorecard/interview-sections";
import { personalEvent } from "../../analytics";
import { routeReports, routeInterviewDetails } from "../../components/utils/route";

function bodyStyleCard() {
    return {
        height: 220,
        overflow: 'scroll'
    };
}

/**
 *
 * @param {Interview[]} interviews
 * @param loadInterviews
 * @param updateInterview
 * @param deleteInterview
 */
const InterviewEvaluation = ({
                                 interviews,
                                 loadInterviews,
                                 updateInterview,
                                 deleteInterview }) => {

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

    const [interview, setInterview] = useState(emptyInterview);

    const { id } = useParams();

    const history = useHistory();

    React.useEffect(() => {
        // initial data loading
        if (!interview.interviewId && interviews.length > 0) {
            setInterview(cloneDeep(findInterview(id, interviews)))
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    const isCompletedStatus = () => interview.status === Status.COMPLETED

    const onAssessmentChanged = assessment => {
        setInterview({
            ...interview,
            decision: assessment
        })
    };

    const onSubmitClicked = () => {
        if (interview.decision) {
            Modal.confirm({
                title: "Submit Candidate Evaluation",
                content: "You will not be able to make changes to this interview-schedule anymore. Are you sure that you want to continue?",
                okText: "Yes",
                cancelText: "No",
                onOk() {
                    updateInterview({
                        ...interview,
                        status: Status.COMPLETED
                    });
                    history.push(routeReports())
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
        history.push(routeReports());
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
                        status="active"
                        strokeLinecap='square'
                        strokeColor='#69C0FF'
                        steps={10}
                        strokeWidth={16}
                        percent={getGroupAssessmentPercent(group)}
                    />
                </Col>
                <Col flex="1" className={styles.divHorizontalCenter}>
                                            <span className={styles.dotSmall}
                                                  style={{ backgroundColor: getGroupAssessmentColor(group) }} />
                    <span>{getGroupAssessmentText(group)}</span>
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
                percent={getOverallPerformancePercent(interview.structure.groups)}
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
                    <InterviewAssessmentButtons
                        assessment={interview.decision}
                        disabled={isCompletedStatus()}
                        onAssessmentChanged={assessment => {
                            if (onAssessmentChanged) {
                                onAssessmentChanged(assessment)
                            }
                        }}
                    />
                    <Button type="primary"
                            onClick={onSubmitClicked}
                            disabled={isCompletedStatus()}>
                        Submit Evaluation
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

                    <div style={{ marginBottom: 12 }}>
                        <InterviewInformationSection
                            title="Candidate Evaluation"
                            onBackClicked={onBackClicked}
                            onDeleteInterview={onDeleteInterview}
                            onEditInterview={onEditInterview}
                            loading={initialLoading()}
                            interview={interview} />
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

const mapDispatch = { loadInterviews, updateInterview, deleteInterview }

const mapState = (state) => {
    const interviewsState = state.interviews || {};
    return {
        interviews: interviewsState.interviews,
    }
}

export default connect(mapState, mapDispatch)(InterviewEvaluation);