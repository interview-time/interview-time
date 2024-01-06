import { connect } from "react-redux";
import { deleteInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { loadTeamMembers, switchTeam } from "../../store/user/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { ApiRequestStatus, RootState } from "../../store/state-models";
import React, { useEffect, useReducer, useState } from "react";
import { interviewReducer, ReducerAction, ReducerActionType } from "./interview-reducer";
import { emptyInterview } from "./interview-scorecard-utils";
import { selectInterviewData, toInterview } from "../../store/interviews/selector";
import Spinner from "../../components/spinner/spinner";
import { Col, message, Modal, Row } from "antd";
import styles from "./interview-scorecard.module.css";
import { routeInterviewReport } from "../../utils/route";
import { useHistory } from "react-router-dom";
import StepAssessmentInterview from "./step-assessment/type-interview/step-assessment-interview";
import {
    Candidate,
    Interview,
    InterviewStatus,
    InterviewType,
    QuestionAssessment,
    TeamMember,
} from "../../store/models";
import ExpandableNotes from "../../components/scorecard/expandable-notes";
import { defaultTo } from "lodash";
import InterviewEvaluation from "./step-evaluation/interview-evaluation";
import { personalEvent } from "../../analytics";
import { useDebounceEffect, useDebounceFn } from "ahooks";
import { log } from "../../utils/log";
import StepAssessmentLiveCoding from "./step-assessment/type-live-coding/step-assessment-live-coding";
import StepAssessmentTakeHome from "./step-assessment/type-take-home/step-assessment-take-home";
import InterviewScorecardHeader from "./interview-scorecard-header";
import { InterviewChecklistCard } from "../../components/scorecard/interview-checklist-card";
import { InterviewInfoCard } from "../../components/scorecard/interview-info-card";

export const DATA_CHANGE_DEBOUNCE_MAX = 10 * 1000; // 10 sec
export const DATA_CHANGE_DEBOUNCE = 2 * 1000; // 2 sec

type Props = {
    teamIdParam: string | null;
    currentTeamId: string;
    originalInterview: Readonly<Interview> | undefined;
    interviewUploading: boolean;
    candidate?: Candidate;
    interviewers: TeamMember[];
    loadInterviews: Function;
    loadCandidates: Function;
    loadTeamMembers: Function;
    updateInterview: Function;
    switchTeam: Function;
};

const InterviewScorecard = ({
    teamIdParam,
    currentTeamId,
    originalInterview,
    interviewUploading,
    candidate,
    interviewers,
    loadInterviews,
    loadCandidates,
    loadTeamMembers,
    updateInterview,
    switchTeam,
}: Props) => {

    const history = useHistory();

    const [interview, dispatch] = useReducer(interviewReducer, emptyInterview());
    const [panelVisible, setPanelVisible] = useState(true);

    const interviewLoaded = interview.interviewId && interview.interviewId.length > 0;
    const interviewStarted = interview.status === InterviewStatus.NEW || interview.status === InterviewStatus.STARTED;
    const interviewCompleted = interview.status === InterviewStatus.COMPLETED;

    useEffect(() => {
        if (originalInterview && !interviewLoaded) {
            dispatch({
                type: ReducerActionType.SET_INTERVIEW,
                interview: originalInterview,
            });
        }
        // eslint-disable-next-line
    }, [originalInterview]);

    useEffect(() => {
        if (teamIdParam && teamIdParam !== currentTeamId) {
            switchTeam(teamIdParam);
        }

        loadInterviews();
        loadCandidates();
        loadTeamMembers(currentTeamId);
        // eslint-disable-next-line
    }, []);

    useDebounceEffect(
        () => {
            if (interviewLoaded) {
                updateInterview(interview);
            }
        },
        [interview],
        {
            wait: DATA_CHANGE_DEBOUNCE,
            maxWait: DATA_CHANGE_DEBOUNCE_MAX,
        }
    );

    const onInterviewChange = (action: ReducerAction) => {
        log("onInterviewChange", action);
        dispatch(action);
    };

    const onCompleteClicked = () => {
        if (canCompleteInterview()) {
            onInterviewChange({
                type: ReducerActionType.UPDATE_STATUS,
                status: InterviewStatus.COMPLETED,
            });
        }
    };

    const onEditClicked = () =>
        onInterviewChange({
            type: ReducerActionType.UPDATE_STATUS,
            status: InterviewStatus.STARTED,
        });

    const onSubmitClicked = () => {
        if (interview.decision) {
            Modal.confirm({
                title: "Submit Candidate Evaluation",
                content:
                    "You will not be able to make changes to this interview anymore. Are you sure that you want to continue?",
                okText: "Yes",
                cancelText: "No",
                onOk() {
                    updateInterview({
                        ...interview,
                        status: InterviewStatus.SUBMITTED,
                    });
                    // use replace instead of push because we don't want user to go back to scorecard screen
                    history.replace(routeInterviewReport(interview.interviewId));
                    personalEvent("Interview completed");
                },
            });
        } else {
            message.error("Please select 'hiring recommendation'.");
        }
    };

    const canCompleteInterview = () => {
        if (interview.interviewType === InterviewType.LIVE_CODING) {
            const noAssessmentQuestion = interview.structure.groups
                .map(group => defaultTo(group.questions, []))
                .flat()
                .find(question => question.assessment === QuestionAssessment.NO_ASSESSMENT);
            if (noAssessmentQuestion) {
                message.info("Please evaluate candidates' code based on assessment criteria.");
                return false;
            }
            if (!interview.liveCodingChallenges?.find(challenge => challenge.selected)) {
                message.info("Please choose challenges to use during the interview.");
                return false;
            }
        }

        return true;
    };

    const onNotesChangeDebounce = useDebounceFn(
        (text: string) => {
            onInterviewChange({
                type: ReducerActionType.UPDATE_NOTES,
                notes: text,
            });
        },
        {
            wait: DATA_CHANGE_DEBOUNCE,
            maxWait: DATA_CHANGE_DEBOUNCE_MAX,
        }
    );

    const onNotesChange = (text: string) => onNotesChangeDebounce.run(text);

    const onRedFlagsChange = (flags: string[]) =>
        onInterviewChange({
            type: ReducerActionType.SET_RED_FLAGS,
            redFlags: flags.map((label, index) => ({
                order: index,
                label: label,
            })),
        });

    const onChecklistItemClicked = (index: number, checked: boolean) => {
        onInterviewChange({
            type: ReducerActionType.UPDATE_CHECKLIST_ITEM,
            index: index,
            checked: checked,
        });
    };

    const onPanelVisibilityChange = (visible: boolean) => setPanelVisible(visible);

    if (!interviewLoaded) {
        return <Spinner />;
    }

    return (
        <Row>
            <div className={styles.rootContainer}>
                <InterviewScorecardHeader
                    candidate={candidate}
                    interview={interview}
                    interviewStarted={interviewStarted}
                    interviewCompleted={interviewCompleted}
                    interviewUploading={interviewUploading}
                    history={history}
                    onPanelVisibilityChange={onPanelVisibilityChange}
                    onEditClicked={onEditClicked}
                    onCompleteClicked={onCompleteClicked}
                    onSubmitClicked={onSubmitClicked}
                />

                {interviewStarted && (
                    <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} className={styles.interviewSectionContainer}>
                        <Row gutter={32}>
                            <Col span={panelVisible ? 18 : 24} className={styles.column}>
                                {interview.interviewType === InterviewType.INTERVIEW && (
                                    <StepAssessmentInterview
                                        interview={interview}
                                        candidate={candidate}
                                        teamMembers={interviewers}
                                        onInterviewChange={onInterviewChange}
                                    />
                                )}

                                {interview.interviewType === InterviewType.LIVE_CODING && (
                                    <StepAssessmentLiveCoding
                                        interview={interview}
                                        onInterviewChange={onInterviewChange}
                                    />
                                )}

                                {interview.interviewType === InterviewType.TAKE_HOME_TASK && (
                                    <StepAssessmentTakeHome
                                        interview={interview}
                                        candidate={candidate}
                                        onInterviewChange={onInterviewChange}
                                    />
                                )}
                            </Col>

                            {panelVisible && <Col span={6} className={styles.column}>
                                <InterviewInfoCard interview={interview} interviewers={interviewers} />

                                {interview.checklist && interview.checklist.length > 0 && (
                                    <InterviewChecklistCard
                                        checklist={interview.checklist}
                                        onChecklistItemClicked={onChecklistItemClicked}
                                    />
                                )}
                            </Col>}
                        </Row>
                    </Col>
                )}

                {interviewCompleted && (
                    <InterviewEvaluation
                        interview={interview}
                        interviewers={interviewers}
                        onInterviewChange={onInterviewChange}
                    />
                )}

                {interviewStarted && (
                    <ExpandableNotes
                        redFlags={defaultTo(interview.redFlags, [])}
                        notes={interview.notes}
                        status={interview.status}
                        onNotesChange={onNotesChange}
                        onRedFlagsChange={onRedFlagsChange}
                    />
                )}
            </div>
        </Row>
    );
};

const mapDispatch = {
    deleteInterview,
    loadInterviews,
    updateInterview,
    loadTeamMembers,
    loadCandidates,
    switchTeam,
};

const mapStateToProps = (state: RootState, ownProps: any) => {
    let searchParams = new URLSearchParams(ownProps.location.search);
    let interviewId = ownProps.match.params.id;

    const interviewData = selectInterviewData(state, interviewId);
    return {
        teamIdParam: searchParams.get("teamId"),
        currentTeamId: state.user.profile.currentTeamId,
        originalInterview: interviewData ? toInterview(interviewData) : undefined,
        interviewUploading: state.interviews.apiResults.UpdateInterview.status === ApiRequestStatus.InProgress,
        candidate: interviewData?.candidateDetails,
        interviewers: interviewData?.interviewersMember ?? [],
    };
};

export default connect(mapStateToProps, mapDispatch)(InterviewScorecard);
