import { connect } from "react-redux";
import { deleteInterview, loadInterviews, updateInterview, updateScorecard } from "../../store/interviews/actions";
import { loadTeamMembers, switchTeam } from "../../store/user/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { RootState } from "../../store/state-models";
import React, { useEffect, useReducer } from "react";
import { interviewReducer, ReducerAction, ReducerActionType } from "./interview-reducer";
import { emptyInterview } from "./interview-scorecard-utils";
import { getCandidateName2, selectInterviewData, toInterview } from "../../store/interviews/selector";
import Spinner from "../../components/spinner/spinner";
import { Button, message, Modal, Row, Space } from "antd";
import styles from "./interview-scorecard.module.css";
import { BackIcon, CloseIcon } from "../../utils/icons";
import { routeHome, routeInterviewReport } from "../../utils/route";
import TimeAgo from "../../components/time-ago/time-ago";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Header from "../../components/header/header";
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
import { Status } from "../../utils/constants";
import InterviewEvaluation from "./step-evaluation/interview-evaluation";
import { personalEvent } from "../../analytics";
import { useDebounceEffect, useDebounceFn } from "ahooks";
import { log } from "../../utils/log";
import StepAssessmentLiveCoding from "./step-assessment/type-live-coding/step-assessment-live-coding";

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
    updateScorecard: Function;
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
    updateScorecard,
    switchTeam,
}: Props) => {
    const history = useHistory();

    const [interview, dispatch] = useReducer(interviewReducer, emptyInterview());

    const interviewLoaded = interview.interviewId && interview.interviewId.length > 0;
    const interviewStarted = interview.status === Status.NEW || interview.status === Status.STARTED;
    const interviewCompleted = interview.status === Status.COMPLETED;

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
                updateScorecard(interview);
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

    const onCompletedClicked = () => {
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
                    updateScorecard({
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

    if (!interviewLoaded) {
        return <Spinner />;
    }

    return (
        <Row>
            <div className={styles.rootContainer}>
                <Header
                    title={getCandidateName2(interview, candidate)}
                    subtitle={candidate?.position ?? ""}
                    leftComponent={
                        <Space size={16}>
                            {history.action !== "POP" ? (
                                <Button icon={<BackIcon />} size='large' onClick={() => history.goBack()} />
                            ) : (
                                <Button
                                    icon={<CloseIcon />}
                                    size='large'
                                    onClick={() => history.replace(routeHome())}
                                />
                            )}
                            <TimeAgo timestamp={interview.modifiedDate} saving={interviewUploading} />
                        </Space>
                    }
                    rightComponent={
                        <Space size={16}>
                            <InterviewStatusTag
                                interviewStartDateTime={new Date(interview.interviewDateTime)}
                                status={interview.status}
                            />
                            {interviewStarted && (
                                <Button type='primary' onClick={onCompletedClicked}>
                                    Complete Interview
                                </Button>
                            )}
                            {interviewCompleted && (
                                <>
                                    <Button onClick={onEditClicked}>Edit</Button>
                                    <Button type='primary' onClick={onSubmitClicked}>
                                        Submit Evaluation
                                    </Button>
                                </>
                            )}
                        </Space>
                    }
                />

                {interview.interviewType === InterviewType.INTERVIEW && interviewStarted && (
                    <StepAssessmentInterview
                        interview={interview}
                        candidate={candidate}
                        teamMembers={interviewers}
                        onInterviewChange={onInterviewChange}
                    />
                )}

                {interview.interviewType === InterviewType.LIVE_CODING && interviewStarted && (
                    <StepAssessmentLiveCoding
                        interview={interview}
                        candidate={candidate}
                        interviewers={interviewers}
                        onInterviewChange={onInterviewChange}
                    />
                )}

                {interviewCompleted && (
                    <InterviewEvaluation
                        interview={interview}
                        candidate={candidate}
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
    updateScorecard,
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
        interviewUploading: state.interviews.uploading,
        candidate: interviewData?.candidate,
        interviewers: interviewData?.interviewersMember ?? [],
    };
};

export default connect(mapStateToProps, mapDispatch)(InterviewScorecard);
