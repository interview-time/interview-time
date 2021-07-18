import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, Col, message, Row, Space } from "antd";
import Layout from "../../components/layout/layout";
import styles from "./interview-scorecard.module.css";
import { connect } from "react-redux";
import { deleteInterview, loadInterviews, updateScorecard } from "../../store/interviews/actions";
import { cloneDeep } from "lodash/lang";
import { debounce } from "lodash/function";
import {
    routeInterviewCandidate,
    routeInterviewDetails,
    routeInterviews,
} from "../../components/utils/route";
import { findInterview, findQuestionInGroups } from "../../components/utils/converters";
import {
    InterviewGroupsSection,
    IntroSection,
    SummarySection,
    InterviewInformationSection,
} from "./interview-sections";
import NotesSection from "./notes-section";
import TimeAgo from "../../components/time-ago/time-ago";
import Spinner from "../../components/spinner/spinner";

const DATA_CHANGE_DEBOUNCE_MAX = 10 * 1000; // 10 sec
const DATA_CHANGE_DEBOUNCE = 2 * 1000; // 2 sec

/**
 *
 * @param {Interview[]} interviews
 * @param {Template[]} templates
 * @param {boolean} interviewsUploading
 * @param deleteInterview
 * @param loadInterviews
 * @param updateScorecard
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewScorecard = ({
    interviews,
    interviewsUploading,
    deleteInterview,
    loadInterviews,
    updateScorecard,
}) => {
    /**
     * @type {Template}
     */

    const [interview, setInterview] = useState();

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

    const initialLoading = () => !interview.interviewId;

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
        updateScorecard(interview);

        message.success(`Interview '${interview.candidate}' updated.`);
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

    const onCandidateEvaluationClicked = () => {
        onSaveClicked();
        history.push(routeInterviewCandidate(interview.interviewId));
    };

    return interview ? (
        <Layout>
            <Row className={styles.rootContainer}>
                <Col
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

                    <Card style={{ marginTop: 12, marginBottom: 12 }}>
                        <div className={styles.divSpaceBetween}>
                            <TimeAgo timestamp={interview.modifiedDate} saving={interviewsUploading} />
                            <Space>
                                <Button loading={interviewsUploading} onClick={onSaveClicked}>
                                    Save
                                </Button>
                                <Button type="primary" onClick={onCandidateEvaluationClicked}>
                                    Next to Candidate Evaluation
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Col>
                <Col
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
                            <a key={group.groupId} href={`#${group.name}`} className={styles.anchorLink}>
                                {group.name}
                            </a>
                        ))}
                        <a href={"#summary"} className={styles.anchorLink}>
                            End of interview
                        </a>
                    </div>
                </Col>
            </Row>
        </Layout>
    ) : (
        <Spinner />
    );
};

const mapDispatch = { deleteInterview, loadInterviews, updateScorecard };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    return {
        interviews: interviewsState.interviews,
        interviewsUploading: interviewsState.uploading,
    };
};

export default connect(mapState, mapDispatch)(InterviewScorecard);
