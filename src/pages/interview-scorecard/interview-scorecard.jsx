import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Modal, Row } from "antd";
import { connect } from "react-redux";
import { deleteInterview, loadInterviews, updateInterview, updateScorecard, } from "../../store/interviews/actions";
import { loadTeamMembers } from "../../store/user/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { cloneDeep } from "lodash/lang";
import { debounce } from "lodash/function";
import { routeInterviewReport, routeInterviewScorecard } from "../../components/utils/route";
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
 * @param {TeamMember[]} teamMembers
 * @param {Candidate[]} candidates
 * @param {boolean} interviewsUploading
 * @param loadInterviews
 * @param loadTeamMembers
 * @param loadCandidates
 * @param updateScorecard
 * @param updateInterview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewScorecard = ({
    interviews,
    teamMembers,
    candidates,
    interviewsUploading,
    loadInterviews,
    loadTeamMembers,
    loadCandidates,
    updateScorecard,
    updateInterview,
}) => {
    /**
     * @type {Interview}
     */
    const [interview, setInterview] = useState(/** @type {Interview|undefined} */undefined);

    const { id } = useParams();

    const history = useHistory();

    useEffect(() => {
        // initial data loading
        if (interviews.length > 0 && !interview) {
            const currentInterview = cloneDeep(findInterview(id, interviews));
            setInterview(currentInterview);
            loadTeamMembers(currentInterview.teamId)
        }
        // eslint-disable-next-line
    }, [interviews]);

    useEffect(() => {
        loadInterviews();
        loadCandidates();

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

    const getCandidate = () => interview && candidates ?
        candidates.find(candidate => candidate.candidateId === interview.candidateId) : undefined

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

    const onEditClicked = () => {
        setInterview({
            ...interview,
            status: Status.STARTED,
        });
    }

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
                    // use replace instead of push because we don't want user to go back to scorecard screen
                    history.replace(routeInterviewReport(interview.interviewId));
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
        <Row>
            {(interview.status === Status.NEW || interview.status === Status.STARTED) && (
                <Assessment
                    interview={interview}
                    teamMembers={teamMembers}
                    candidate={getCandidate()}
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
                    teamMembers={teamMembers}
                    candidate={getCandidate()}
                    onSubmitClicked={onSubmitClicked}
                    onEditClicked={onEditClicked}
                    onNoteChanges={onNoteChanges}
                    onAssessmentChanged={onAssessmentChanged}
                    interviewsUploading={interviewsUploading}
                />
            )}
        </Row>
    ) : (
        <Spinner />
    );
};

const mapDispatch = {
    deleteInterview,
    loadInterviews,
    updateScorecard,
    updateInterview,
    loadTeamMembers,
    loadCandidates
};
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const userState = state.user || {};
    const candidatesState = state.candidates || {};
    return {
        interviews: interviewsState.interviews,
        teamMembers: userState.teamMembers,
        candidates: candidatesState.candidates,
        interviewsUploading: interviewsState.uploading,
    };
};

export default connect(mapState, mapDispatch)(InterviewScorecard);
