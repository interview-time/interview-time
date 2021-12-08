import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, Modal, Row } from "antd";
import Layout from "../../components/layout/layout";
import styles from "./interview-scorecard.module.css";
import { connect } from "react-redux";
import {
    deleteInterview,
    loadInterviews,
    updateScorecard,
    updateInterview,
} from "../../store/interviews/actions";
import { cloneDeep } from "lodash/lang";
import { debounce } from "lodash/function";
import { routeReports } from "../../components/utils/route";
import { findInterview, findQuestionInGroups } from "../../components/utils/converters";

import Spinner from "../../components/spinner/spinner";

import { Status } from "../../components/utils/constants";
import { personalEvent } from "../../analytics";
import Assessment from "./assessment";
import Evaluation from "./evaluation";

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
 * @param updateInterview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewScorecard = ({
    interviews,
    interviewsUploading,
    loadInterviews,
    updateScorecard,
    updateInterview,
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

    const onQuestionNotesChanged = (questionId, notes) => {
        setInterview((prevInterview) => {
            findQuestionInGroups(questionId, prevInterview.structure.groups).notes = notes;

            return { ...prevInterview };
        });
    };

    const onQuestionAssessmentChanged = (questionId, assessment) => {
        setInterview((prevInterview) => {
            findQuestionInGroups(questionId, prevInterview.structure.groups).assessment =
                assessment;

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

    const onCompletedClicked = () => {
        updateInterview({
            ...interview,
            status: Status.COMPLETED,
        });
        setInterview({
            ...interview,
            status: Status.COMPLETED,
        });
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
                        status: Status.SUBMITTED,
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

    return interview ? (
        <Layout>
            <Row className={styles.rootContainer}>
                <Col span={24} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
                    {(interview.status === Status.NEW || interview.status === Status.STARTED) && (
                        <Assessment
                            interview={interview}
                            onCompletedClicked={onCompletedClicked}
                            onQuestionNotesChanged={onQuestionNotesChanged}
                            onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                            onNoteChanges={onNoteChanges}
                            interviewsUploading={interviewsUploading}
                        />
                    )}
                    {interview.status === Status.COMPLETED && (
                        <Evaluation
                            interview={interview}
                            onSubmitClicked={onSubmitClicked}
                            onAssessmentChanged={onAssessmentChanged}
                        />
                    )}
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
